# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import json
import re

from PyPDF2 import PdfReader


def read_entry_list(pdf_path: str, clss: str="Medallia Superbike") -> list:
    """
    Reads an entry list pdf at 'pdf_path' and returns a list of entrants
    """

    rider_list = []
    with open(pdf_path, 'rb') as f:
        pdf = PdfReader(f)
        # information = pdf.getDocumentInfo()
        # number_of_pages = pdf.getNumPages()
        page_lines = pdf.pages[0].extract_text().split('\n')
        num_riders_line_idx = -1
        for page_ln in page_lines:
            num_riders_line_idx += 1
            if page_ln.startswith(clss + ' -'):
                break

        print(num_riders_line_idx)
        print(page_lines[num_riders_line_idx])
        # num_riders_lines = page_lines[13]
        num_riders_line = page_lines[num_riders_line_idx]
        num_riders = int(re.search(f'{clss}\s-\s+([0-9]+)', num_riders_line).group(1))

        rider_list_start_idx = num_riders_line_idx + 2
        for ln in page_lines[rider_list_start_idx:rider_list_start_idx+num_riders]:
            search_ln = re.search(
                # Number   Name  Hometown  Team    Bike   Nationality
                '([0-9]+)\s(.+)\s\s(.+)\s\s(.+)\s\s(.+)\s([A-Z][A-Z][A-Z])',
                ln
            )
            if search_ln:
                rider = {
                    "number": int(search_ln.group(1)),
                    "name": search_ln.group(2),
                    "team": search_ln.group(4),
                    "bike": search_ln.group(5)
                }
                rider_list.append(rider)
            # else:
            #     quick_search = re.search('([0-9]+)\s+(\w+ \w+ ?\w+)', ln)
            #     breakpoint()

        return rider_list


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    rdr_lst = {}
    rdr_lst["Medallia Superbike"] = read_entry_list('./pdfs/22_11_BARBER_SBK_P1_entry.pdf')
    rdr_lst["STG Junior Cup"] = read_entry_list(
        './pdfs/22_11_BARBER_JRC_P1_entry.pdf', clss="STG Junior Cup"
    )
    with open('riders.json', 'w+') as f:
        json.dump(rdr_lst, f, indent=2)


