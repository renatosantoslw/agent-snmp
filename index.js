var snmp = require("net-snmp");
var getopts = require("getopts");

var options = getopts(process.argv.slice(2));

var snmpOptions = {
    disableAuthorization: options.n,
    port: options.p,
    engineID: options.e,
    debug: options.d,
    address: null,
    accessControlModelType: snmp.AccessControlModelType.Simple
};

var callback = function (error, data) {
    if (error) {
        console.error(error);
    } else {
        //console.log(JSON.stringify(data, null, 2));
    }
};

var agent = snmp.createAgent(snmpOptions, callback);
var authorizer = agent.getAuthorizer();

authorizer.addCommunity("public");

// Registro de sysDescr
var scalarProvider = {
    name: "sysDescr",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.2.1.1.1",
    scalarType: snmp.ObjectType.OctetString,
    maxAccess: snmp.MaxAccess['read-only'],
    constraints: {
        sizes: [
            { min: 1, max: 3 },
            { min: 5 }
        ]
    }
};
agent.registerProvider(scalarProvider);

// Adicionando outros OIDs do MIB II
var sysUpTimeProvider = {
    name: "sysUpTime",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.2.1.1.3",
    scalarType: snmp.ObjectType.TimeTicks,
    maxAccess: snmp.MaxAccess['read-only'],
};

var sysContactProvider = {
    name: "sysContact",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.2.1.1.4",
    scalarType: snmp.ObjectType.OctetString,
    maxAccess: snmp.MaxAccess['read-only'],
};

var sysNameProvider = {
    name: "sysName",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.2.1.1.5",
    scalarType: snmp.ObjectType.OctetString,
    maxAccess: snmp.MaxAccess['read-only'],
};

var sysLocationProvider = {
    name: "sysLocation",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.2.1.1.6",
    scalarType: snmp.ObjectType.OctetString,
    maxAccess: snmp.MaxAccess['read-only'],
};

// Registrando os provedores adicionais
agent.registerProvider(sysUpTimeProvider);
agent.registerProvider(sysContactProvider);
agent.registerProvider(sysNameProvider);
agent.registerProvider(sysLocationProvider);

var tableProvider = {
    name: "ifTable",
    type: snmp.MibProviderType.Table,
    oid: "1.3.6.1.2.1.2.2.1",
    maxAccess: snmp.MaxAccess['not-accessible'],
    tableColumns: [
        {
            number: 1,
            name: "ifIndex",
            type: snmp.ObjectType.Integer,
            maxAccess: snmp.MaxAccess['read-only']
        },
        {
            number: 2,
            name: "ifDescr",
            type: snmp.ObjectType.OctetString,
            maxAccess: snmp.MaxAccess['read-write'],
            constraints: {
                sizes: [
                    { min: 1, max: 255 },
                ]
            },
            defVal: "Hello world!"
        },
        {
            number: 3,
            name: "ifType",
            type: snmp.ObjectType.Integer,
            maxAccess: snmp.MaxAccess['read-only'],
            constraints: {
                enumeration: {
                    "1": "goodif",
                    "2": "badif",
                    "6": "someif",
                    "24": "anotherif"
                }
            },
			defVal: 6
        },
        {
            number: 8,
            name: "ifOperStatus",
            type: snmp.ObjectType.Integer,
            maxAccess: snmp.MaxAccess['read-only'],
            rowStatus: true
        }
    ],
    tableIndex: [
        {
            columnName: "ifIndex"
        }
    ],
    handler: function ifTable (mibRequest) {
        // e.g. can update the table before responding to the request here
        mibRequest.done ();
    }
};
agent.registerProvider (tableProvider);

// Configurando os valores iniciais
var mib = agent.getMib();
mib.setScalarValue("sysDescr", "Emulador SNMP - Android - Dev: Renato Santos - Termux/Alpine");
mib.setScalarValue("sysUpTime", 123456); // Exemplo de tempo de atividade
mib.setScalarValue("sysContact", "contato@email.com");
mib.setScalarValue("sysName", "Android - Celular");
mib.setScalarValue("sysLocation", "RB-AC");

mib.addTableRow ("ifTable", [1, "eth0", 1, 1]);

// Exibir informações da MIB
mib.dump({
    leavesOnly: true,
    showProviders: true,
    showValues: true,
    showTypes: true
});

var acm = authorizer.getAccessControlModel();
acm.setCommunityAccess("public", snmp.AccessLevel.ReadOnly);

console.log(acm.getCommunitiesAccess());
