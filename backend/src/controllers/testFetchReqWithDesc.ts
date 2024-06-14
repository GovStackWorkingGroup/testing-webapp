import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { RequirementStatusEnum } from 'myTypes'; // Adjust the import path based on your project structure
import GitBookPageContentManager from '../services/gitBookService/PageContentManager';
import BBRequirements from '../db/schemas/bbRequirements';
import * as XLSX from 'xlsx';
import { processBBRequirements } from '../services/gitBookService/bbRequirementsProcessing';
import syncGitBookBBRequirements from '../cronJobs/syncGitBookBBRequirements';

// Initialize GitBookPageContentManager instance
const gitBookPageContentManager = new GitBookPageContentManager();

// Function to fetch requirements and transform them
async function fetchRequirements() {
    const requirements = await BBRequirements.find().lean();

    return requirements.map(bb => ({
        bbName: bb.bbName,
        requirements: {
            crossCutting: (bb.requirements?.crossCutting ?? []).map((req: any) => req.requirement),
            functional: (bb.requirements?.functional ?? []).map((req: any) => req.requirement),
            interface: (bb.requirements?.interface ?? []).map((req: any) => req.requirement),
            keyDigitalFunctionalities: (bb.requirements?.keyDigitalFunctionalities ?? []).map((req: any) => req.requirement),
        }
    }));
}

// Function to save requirements to an Excel file
async function saveToExcel(requirements: any[], filename: string) {
    const wb = XLSX.utils.book_new();

    requirements.forEach(bb => {
        const ws_data = [
            ["Requirement Type", "Requirement"]
        ];

        const addRequirements = (type: string, reqs: string[]) => {
            reqs.forEach(req => {
                ws_data.push([type, req]);
            });
        };

        addRequirements('Cross-Cutting', bb.requirements.crossCutting);
        addRequirements('Functional', bb.requirements.functional);
        addRequirements('Interface', bb.requirements.interface);

        const ws = XLSX.utils.aoa_to_sheet(ws_data);

        // Set column width and text wrapping
        const wscols = [
            { wch: 20 }, // "wch" means "characters width", 20 characters wide
            { wch: 80 }  // Second column wider for the requirements
        ];
        ws['!cols'] = wscols;

        // Apply styles to all cells
        const range = XLSX.utils.decode_range(ws['!ref']!);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);

                if (!ws[cell_ref]) ws[cell_ref] = { t: 's', v: '' }; // Ensure cell exists

                // Apply styles
                ws[cell_ref].s = {
                    fill: { fgColor: { rgb: "F2F4FC" } }, // Background color
                    font: { name: "Arial" }, // Font
                    alignment: { wrapText: true } // Text wrapping
                };
            }
        }

        XLSX.utils.book_append_sheet(wb, ws, bb.bbName);
    });

    XLSX.writeFile(wb, filename);
}

// Function to append requirements to an existing Excel file
async function appendToExcel(requirements: any[], filename: string) {
    const wb = XLSX.readFile(filename);

    requirements.forEach(bb => {
        let ws = wb.Sheets[bb.bbName];

        if (!ws) {
            // Create a new sheet if it doesn't exist
            const ws_data = [
                ["Requirement Type", "Requirement"]
            ];

            const addRequirements = (type: string, reqs: string[]) => {
                reqs.forEach(req => {
                    ws_data.push([type, req]);
                });
            };

            addRequirements('Cross-Cutting', bb.requirements.crossCutting);
            addRequirements('Functional', bb.requirements.functional);
            addRequirements('Interface', bb.requirements.interface);

            ws = XLSX.utils.aoa_to_sheet(ws_data);

            // Set column width and text wrapping
            const wscols = [
                { wch: 20 }, // "wch" means "characters width", 20 characters wide
                { wch: 80 }  // Second column wider for the requirements
            ];
            ws['!cols'] = wscols;

            XLSX.utils.book_append_sheet(wb, ws, bb.bbName);
        } else {
            const range = XLSX.utils.decode_range(ws['!ref']!);
            const startColumn = range.e.c + 1; // Start from the next empty column
            const startRow = 1; // Start from the second row (index 1)

            const addRequirements = (type: string, reqs: string[], col: number) => {
                reqs.forEach((req, index) => {
                    const cell_address = { c: col, r: startRow + index };
                    const cell_ref = XLSX.utils.encode_cell(cell_address);
                    ws[cell_ref] = { v: req };
                    const type_cell_ref = XLSX.utils.encode_cell({ c: col - 1, r: startRow + index });
                    ws[type_cell_ref] = { v: type };
                });
            };

            addRequirements('Cross-Cutting', bb.requirements.crossCutting, startColumn);
            addRequirements('Functional', bb.requirements.functional, startColumn + 2);
            addRequirements('Interface', bb.requirements.interface, startColumn + 4);

            ws['!ref'] = XLSX.utils.encode_range(range.s, { c: startColumn + 4, r: Math.max(startRow + bb.requirements.crossCutting.length, startRow + bb.requirements.functional.length, startRow + bb.requirements.interface.length) - 1 });
        }
    });

    XLSX.writeFile(wb, filename);
}

// Controller function
export const testFetchReqWithDesc = async (_: Request, res: Response) => {
    try {
        const result = await processBBRequirements();

        // Fetch the current requirements and transform them
        const requirements = await fetchRequirements();

        // Save to or append to the Excel file
        const filename = 'requirements.xlsx';
        
        // Ensure the file exists before trying to read it
        if (!fs.existsSync(filename)) {
            await saveToExcel(requirements, filename);
        } else {
            await appendToExcel(requirements, filename);
        }

        res.status(200).json({ requirements: requirements });
    } catch (error) {
        console.error('Error processing requirements:', error);
        res.status(500).json({ error: 'Failed to process requirements' });
    }
};

// THIS IS FOR MERGING FILES TO ONE
// export const testFetchReqWithDesc = async (_: Request, res: Response) => {
//     try {
//         // Open both Excel files
//         const filename1 = 'requirements-old.xlsx';
//         const filename2 = 'requirements-new.xlsx';
//         const mergedFilename = 'merged-req.xlsx';

//         if (!fs.existsSync(filename1) || !fs.existsSync(filename2)) {
//             throw new Error('One or both files do not exist');
//         }

//         const wb1 = XLSX.readFile(filename1);
//         const wb2 = XLSX.readFile(filename2);
//         const mergedWb = XLSX.utils.book_new();

//         // Iterate through the sheets in the first workbook
//         wb1.SheetNames.forEach(sheetName => {
//             const ws1 = wb1.Sheets[sheetName];
//             const ws2 = wb2.Sheets[sheetName];

//             if (ws2) {
//                 // Merge sheets if they both exist
//                 const data1 = XLSX.utils.sheet_to_json(ws1, { header: 1 });
//                 const data2 = XLSX.utils.sheet_to_json(ws2, { header: 1 });

//                 // Find the maximum number of rows in both sheets
//                 const maxRows = Math.max(data1.length, data2.length);
//                 const mergedData: any[] = [];

//                 for (let i = 0; i < maxRows; i++) {
//                     const row1: any = data1[i] || [];
//                     const row2: any = data2[i] || [];
//                     mergedData.push([...row1, ...row2]);
//                 }

//                 const mergedWs = XLSX.utils.aoa_to_sheet(mergedData);

//                 // Set column width and text wrapping
//                 const wscols = [
//                     { wch: 20 }, // Width for the first column
//                     { wch: 80 }, // Width for the requirements
//                     { wch: 20 }, // Width for the new first column
//                     { wch: 80 }  // Width for the new requirements
//                 ];
//                 mergedWs['!cols'] = wscols;

//                 XLSX.utils.book_append_sheet(mergedWb, mergedWs, sheetName);
//             } else {
//                 // If the sheet only exists in the first workbook, copy it as is
//                 XLSX.utils.book_append_sheet(mergedWb, ws1, sheetName);
//             }
//         });

//         // Add sheets from the second workbook that do not exist in the first workbook
//         wb2.SheetNames.forEach(sheetName => {
//             if (!wb1.SheetNames.includes(sheetName)) {
//                 const ws2 = wb2.Sheets[sheetName];
//                 XLSX.utils.book_append_sheet(mergedWb, ws2, sheetName);
//             }
//         });

//         // Write the merged workbook to a new file
//         XLSX.writeFile(mergedWb, mergedFilename);

//         res.status(200).json({ message: 'Files merged successfully', filename: mergedFilename });
//     } catch (error) {
//         console.error('Error processing requirements:', error);
//         res.status(500).json({ error: 'Failed to process requirements' });
//     }
// };