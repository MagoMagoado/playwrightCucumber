# language: pt
Funcionalidade: Validações Campos Extras

  Cenário: Validação Campos Extras
    Dado que efetuo o login "NACIONAL" utilizando o usuário "LOGIN_1"
    E clico no botão "Módulo: Export"
    E que estou no documento "CAMPOS_EXTRAS_PAG"
    E acesso o menu "Dados Mestres > Configurações de Personalização > Campos Extras"
    E seleciono no combobox "Filtro: Sistema" a opção "Export"
    E preencho o campo "Filtro: Entidade" com "frm_AdiantamentoDespesas"
    E clico no botão "Filtrar"
    E clico no botão "Grid Visualizar"
    E valido se "Último editar grid" está "DESABILITADO"
    E pause
    
    # Dado que efetuo o login "NACIONAL" utilizando o usuário "LOGIN_1" //método loginPage
    # E clico no botão "Módulo: Export" //botao de commonsElements
    # E que estou no documento "CAMPOS_EXTRAS_PAG" // Deve carregar elementos de camposExtras no elementMap
    # E acesso o menu "Dados Mestres > Configurações de Personalização > Campos Extras"
    # E seleciono no combobox "Filtro: Sistema" a opção "Export" //botao de camposExtras
    # E preencho o campo "Filtro: Entidade" com "frm_AdiantamentoDespesas" //botao de camposExtras
    # E clico no botão "Filtrar" //botao de commonsElements
    # E clico no botão "Grid Visualizar" //botao de camposExtras
    # E valido se "Último editar grid" está "DESABILITADO" //método que deve ser lido de camposExtrasPage e não da commonsPage
    # E pause
