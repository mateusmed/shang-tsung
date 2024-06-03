Execute localmente para o entendimento:
[execute localmente](doc/example-of-run/example-of-run-json-to-xml.md)



O objetivo do projeto é converter um json nested em um xml


para isso é necessário especificar um map



JSON INPUT
  
```
{
    "clientes": [
        {
            "enderecos": [
                {
                    "endereco": "rua a"
                },
                {
                    "endereco": "rua b"
                },
                {
                    "endereco": "rua c"
                }
            ],

            "nome": "mateus",
            "telefone": [
                {
                    "numero": "123",
                    "ligacoes_locais": [
                        {
                            "numero_regional": "777.0"
                        }
                    ],
                    "ligacoes_internacionais": [
                        {
                            "numero_internacional": "999.0"
                        }
                    ]
                },
                {
                    "numero": "456",
                    "ligacoes_locais": [
                        {
                            "numero_regional": "888.0"
                        }
                    ],
                    "ligacoes_internacionais": [
                        {
                            "numero_internacional": "999.0"
                        },
                        {
                            "numero_internacional": "555.0"
                        }
                    ]
                }
            ]
        },
        {
            "nome": "gabrielle",
            "telefone": [
                {
                    "numero": "123456",
                    "ligacoes_locais": [
                        {
                            "numero_regional": "nan"
                        }
                    ],
                    "ligacoes_internacionais": [
                        {
                            "numero_internacional": "nan"
                        }
                    ]
                }
            ],
            "enderecos": [
                {
                    "endereco": "rua a"
                },
                {
                    "endereco": "rua b"
                },
                {
                    "endereco": "rua c"
                }
            ]
        }
    ]
}
```

MAPA

```
<clientes another="ok">

    <cliente jsonReference="clientes"
             nome="$$nome">

        <telefones>

                <telefone jsonReference="telefone"
                          numero="$$numero">

                        <ligacoes_locais jsonReference="ligacoes_locais">
                            <numero_regional jsonReference="numero_regional">
                            </numero_regional>
                        </ligacoes_locais>

                        <ligacoes_internacionais jsonReference="ligacoes_internacionais">
                            <numero_internacional jsonReference="numero_internacional">
                            </numero_internacional>
                        </ligacoes_internacionais>

                </telefone>

        </telefones>

        <enderecos jsonReference="enderecos">
            <endereco jsonReference="endereco">
            </endereco>
        </enderecos>

    </cliente>
</clientes>
```



RESULTADO

```
<clientes another="ok">
    <cliente nome="mateus">
        <telefones>
            <telefone numero="123">
                <ligacoes_locais>
                    <numero_regional>
                        777.0
                    </numero_regional>
                </ligacoes_locais>
                <ligacoes_internacionais>
                    <numero_internacional>
                        999.0
                    </numero_internacional>
                </ligacoes_internacionais>
            </telefone>
            <telefone numero="456">
                <ligacoes_locais>
                    <numero_regional>
                        888.0
                    </numero_regional>
                </ligacoes_locais>
                <ligacoes_internacionais>
                    <numero_internacional>
                        999.0
                    </numero_internacional>
                    <numero_internacional>
                        555.0
                    </numero_internacional>
                </ligacoes_internacionais>
            </telefone>
        </telefones>
        <enderecos>
            <endereco>
                rua a
            </endereco>
            <endereco>
                rua b
            </endereco>
            <endereco>
                rua c
            </endereco>
        </enderecos>
    </cliente>
    <cliente nome="gabrielle">
        <telefones>
            <telefone numero="123456">
                <ligacoes_locais>
                    <numero_regional>
                        nan
                    </numero_regional>
                </ligacoes_locais>
                <ligacoes_internacionais>
                    <numero_internacional>
                        nan
                    </numero_internacional>
                </ligacoes_internacionais>
            </telefone>
        </telefones>
        <enderecos>
            <endereco>
                rua a
            </endereco>
            <endereco>
                rua b
            </endereco>
            <endereco>
                rua c
            </endereco>
        </enderecos>
    </cliente>
</clientes>

```

---

No mapa é necessário especificar apenas

```
jsonReference="<jsonAttribute>"
```

A tag $$ significa que esse atríbuto é um identificador daquela tag
por tanto ele deverá ser um atributo da tag
```
numero="$$<jsonAttribute>"
```

---


Se vc remover os atributos identificadores vc tera uma junção de todos os valores
vamos supor, vc quer pegar apenas todos os telefones
então vc passa esse mapa:

MAPA

```

<clientes another="ok">

    <cliente jsonReference="clientes">

        <telefones>

                <telefone jsonReference="telefone">

                        <ligacoes_locais jsonReference="ligacoes_locais">
                            <numero_regional jsonReference="numero_regional">
                            </numero_regional>
                        </ligacoes_locais>

                        <ligacoes_internacionais jsonReference="ligacoes_internacionais">
                            <numero_internacional jsonReference="numero_internacional">
                            </numero_internacional>
                        </ligacoes_internacionais>

                </telefone>

        </telefones>
        
    </cliente>

</clientes>

```


SAÍDA

```
<clientes another="ok">
    <cliente>
        <telefone>
            <ligacoes_locais>
                <numero_regional>
                    777.0
                </numero_regional>
                <numero_regional>
                    888.0
                </numero_regional>
                <numero_regional>
                    nan
                </numero_regional>
            </ligacoes_locais>
            <ligacoes_internacionais>
                <numero_internacional>
                    999.0
                </numero_internacional>
                <numero_internacional>
                    999.0
                </numero_internacional>
                <numero_internacional>
                    555.0
                </numero_internacional>
                <numero_internacional>
                    nan
                </numero_internacional>
            </ligacoes_internacionais>
        </telefone>
    </cliente>
</clientes>

```
