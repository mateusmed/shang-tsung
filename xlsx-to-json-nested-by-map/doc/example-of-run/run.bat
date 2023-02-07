@echo off
cls
@echo.
@echo    ****************************************************************************
@echo    ***                                                                      ***
@echo    ***    desenvolvido por Mateus Medeiros - 2022   			    ***
@echo    ***    linkedin: https://www.linkedin.com/in/mateus-medeiros-14a038164/  ***
@echo    ***                                         			            ***
@echo    ****************************************************************************
@echo.

set xlsx_input=%~dp0arquivos-config\input\teste_planilha.xlsx
set json_mask=%~dp0arquivos-config\masks\json_mask.json
set json_out=%~dp0arquivos-config\output\json_out.json

set xlsx_to_json_nested_by_map_run=%~dp0..\..\src\run.py
@echo %xlsx_to_json_nested_by_map_run%

python "%xlsx_to_json_nested_by_map_run%" %json_mask% %xlsx_input% %json_out%


timeout 2

@echo    ****************************************************************************
@echo    *** PARECE TUDO OK, O ARQUIVO FOI GERADO EM:
@echo    *** %json_out%
@echo    ****************************************************************************

pause
