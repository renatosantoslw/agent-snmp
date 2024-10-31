# SNMP Emulator

Este projeto é um emulador simples de um agente SNMP (Simple Network Management Protocol) utilizando a biblioteca `net-snmp` para Node.js. Ele fornece a funcionalidade básica de um agente SNMP, permitindo a consulta de informações de gerenciamento de rede, como descrições de sistema, tempo de atividade, contatos e interfaces de rede.

## Recursos

- **Registro de OIDs**: Suporte para OIDs padrão do MIB II, incluindo:
  - `sysDescr`: Descrição do sistema
  - `sysUpTime`: Tempo de atividade do sistema
  - `sysContact`: Informações de contato do administrador
  - `sysName`: Nome do sistema
  - `sysLocation`: Localização do sistema
- **Tabela de Interfaces**: Implementação de uma tabela de interfaces (ifTable) com colunas para:
  - `ifIndex`: Índice da interface
  - `ifDescr`: Descrição da interface
  - `ifType`: Tipo de interface
  - `ifOperStatus`: Status operacional da interface
- **Configuração de Comunidades SNMP**: Permite a configuração de comunidades e níveis de acesso.

## Como Usar

1. Clone este repositório em sua máquina local.
   ```bash
   git clone https://github.com/seu-usuario/snmpe-emulator.git
   cd snmp-emulator
