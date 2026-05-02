import pymupdf

class PDFProcessor:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def extract_text(self) -> str:
        try:
            # Uso do 'with' é o padrão moderno para abrir arquivos
            with pymupdf.open(self.file_path) as doc:
                # Extração eficiente usando list comprehension
                return "".join(page.get_text() for page in doc)
        
        except Exception as e:
            # Em sistemas modernos, considere usar logging em vez de print
            print(f"Erro ao processar o PDF: {e}")
            return ""
