
Run locally for knowlloge:
[run_locally](doc/example-of-run/en-example-of-run-json-to-xml.md)


the intention of project is convert json nested in xml
todo this is necessary specify a map

this is a input structure you need to convert,
the module: 

- xlsx-to-json-nested-by-map

build exactly structure necessary

example of JSON INPUT:
  
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

this is a MAP:

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


this is OUTPUT:

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

In the map is necessary only pass jsonRefference, like:

```
jsonReference="<jsonAttribute>"
```

The tag $$ meaning of this attribute is identify, this is used to make aggregation

```
<telefone jsonReference="telefone"
          numero="$$numero">
```

```
numero="$$<jsonAttribute>"
```

---

If you remove all attributes identify you will be get a join of all values
for example, will you want to catch only phoneNumbers(telefone), you need to pass this map:


MAP:

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


OUTPUT:

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
