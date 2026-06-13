# language: pt
Funcionalidade: Validações Campos Extras

  Cenário: 5344722 - Validações seção Campos Extras em telas
    Dado que efetuo o login "NACIONAL" utilizando o usuário "AUT_IS_BR_01"
    E clico no módulo "Import"
    Quando acesso pelo menu "Financeiro" a página "Adiantamentos e Pagamentos"
    E que estou no documento "CAMPOS_EXTRAS_PAG"
    E clico no botão "Filtro: Adicionar"
    # Validação Campo Extras - Seção ativada
    Então visualizo o "SUBTÍTULO" com a mensagem "Campo Extra"
    E clico no botão "Principal: Voltar"
    # Validação Campo Extras - Seção desativada
    E clico no botão "Filtro: Adicionar"
    Então não visualizo o "SUBTÍTULO" com a mensagem "Campo Extra"
