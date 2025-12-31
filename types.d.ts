declare global {
    interface Window {
        Papa: {
            parse: (file: File, config: {
                header: boolean;
                encoding: string;
                complete: (results: any) => void;
                error: (error: any) => void;
            }) => void;
        };
        XLSX: {
            utils: {
                aoa_to_sheet: (data: any[][]) => any;
                book_new: () => any;
                book_append_sheet: (workbook: any, worksheet: any, name: string) => void;
            };
            writeFile: (workbook: any, filename: string) => void;
        };
    }
}

export {};
