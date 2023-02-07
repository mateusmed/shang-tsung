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

set json_input=%~dp0arquivos-config\input\json_input.json
set xml_mask=%~dp0arquivos-config\masks\xml_mask.xml
set xml_out=%~dp0arquivos-config\output\xml_out.xml

set json-to-xml-by-map-run=%~dp0..\..\src\main.js
@echo %json-to-xml-by-map%


node "%json-to-xml-by-map-run%" %xml_mask% %json_input% %xml_out%


timeout 2

@echo    ****************************************************************************
@echo    *** PARECE TUDO OK, O ARQUIVO FOI GERADO EM:
@echo    *** %xml_out%
@echo    ****************************************************************************

pause
