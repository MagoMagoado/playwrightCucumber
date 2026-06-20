# language: pt
Funcionalidade: Validações de teste

  Contexto: Login Usuário Comum
    Dado que acesso o sistema "QA"
    Quando clico no botão "Sign in"
    E que efetuo o login utilizando o usuário "Jano Doe"
    Então "VISUALIZO" "TÍTULO" com a mensagem "My account"
    # E valido que endpoint "Dados Usuário" foi chamado

  Cenário: Validações Filtro Home
    Dado acesso o menu "Home"
    # E valido que endpoint "Produtos Home" foi chamado
    E que estou no documento "HOME"
    Quando preencho o combobox "Filtro: Sort" com "Name (A - Z)"
    E valido que combobox "Filtro: Sort" possui opções
      | OPCAO              |
      | Name (A - Z)       |
      | Name (Z - A)       |
      | Price (High - Low) |
      | Price (Low - High) |
      | CO₂ Rating (A - E) |
      | CO₂ Rating (E - A) |
    # E valido se endpoint "Produtos Home" contém em "data" valores
    #   | Adjustable Wrench  |
    #   | Angled Spanne      |
    #   | Belt Sander        |
    #   | Bolt Cutters       |
    #   | Chisels Set        |
    #   | ...                |
    Então valido os campos por label
      | NOME         | TIPO  | VALOR              |
      | Produto Nome | CAMPO | Adjustable Wrench  |
      | Produto Nome | CAMPO | Angled Spanner     |
      | Produto Nome | CAMPO | Belt Sander        |
      | Produto Nome | CAMPO | Bolt Cutters       |
    E o campo "Filtro: By category" deve conter o valor "By category:"
    Quando preencho o campo "Filtro: Search" com "Hammer"
    E clico no botão "Search"
    Então "VISUALIZO" "Quantidade Produtos" com a mensagem "6 products found for 'Hammer'"
    # E valido se endpoint "Produtos Home" contém em "data" valores
    #   | Claw Hammer with Shock Reduction Grip |
    #   | Hammer                                |
    #   | Claw Hammer                           |
    #   | Thor Hammer                           |
    #   | Claw Hammer with Fiberglass Handle    |
    #   | Court Hammer                          |
    Então valido os campos por label
      | NOME         | TIPO  | VALOR                                 |
      | Produto Nome | CAMPO | Claw Hammer with Shock Reduction Grip |
      | Produto Nome | CAMPO | Hammer                                |
      | Produto Nome | CAMPO | Claw Hammer                           |
      | Produto Nome | CAMPO | Thor Hammer                           |
      | Produto Nome | CAMPO | Claw Hammer with Fiberglass Handle    |
      | Produto Nome | CAMPO | Court Hammer                          |

  Cenário: Validações Filtro Falha
    Dado acesso o menu "Home"
    # E valido que endpoint "Produtos Home" foi chamado
    E que estou no documento "HOME"
    Quando "MARCO" o checkbox "Filtro: Hand Saw"
    Então valido se checkbox "Filtro: Hand Saw" está "MARCADO"
    Então valido os campos por label
      | NOME         | TIPO  | VALOR  |
      | Produto Nome | CAMPO | Hammer |

