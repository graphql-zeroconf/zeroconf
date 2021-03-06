# Zeroconf

The simplest way to start graphql with zero configuration on existing database.

Zeroconf supports to generate C.R.U.D API automatically. It has powerful where clauses for query and also has interface which called hook in each C.U.D mutations.

## How to get started

MySQL

[https://github.com/graphql-zeroconf/zeroconf_mysql_template](https://github.com/graphql-zeroconf/zeroconf_mysql_template)

Postgres

[https://github.com/graphql-zeroconf/zeroconf_postgresql_template](https://github.com/graphql-zeroconf/zeroconf_postgresql_template)


SQLite

[https://github.com/graphql-zeroconf/zeroconf_sqlite_template](https://github.com/graphql-zeroconf/zeroconf_sqlite_template)

MSSQL

[https://github.com/graphql-zeroconf/zeroconf_mssql_template](https://github.com/graphql-zeroconf/zeroconf_mssql_template)



## Support Generating C.R.U.D API

Lets say that we have user table on our database. In this case zeroconf CRUD schema will be generated with its table name.

The zeroconf will generates object types and mutations, queries over the your table name.

  If you have a table which named <span style="color:red">**user**</span>, zeroconf will generate these things.

  - type <span style="color:red">**User**</span>
  - Query { <span style="color:red">**user**</span>, <span style="color:red">**users**</span>, <span style="color:red">**numUser**</span> }
  - Subscription { <span style="color:red">**user**</span>, <span style="color:red">**users**</span>, <span style="color:red">**numUser**</span> }
  - Mutation { <span style="color:red">**createUser**</span>, <span style="color:red">**updateUsers**</span>, <span style="color:red">**deleteUser**</span> }

### Automatically Generated Queries:

- generated singluar name Query field for fetching one row

  <span style="color:red">**user**</span>(**where**: <span style="color:red">UserWhereInput!</span>): User

- generated plural name Query field for fetching all row on some query condition:

  <span style="color:red">**users**</span>(**limit**: Int, **start**: Int, **where**: JSON, **order**: <span style="color:red">UserOrderInput</span>)

### Automatically Generated Subscriptions:

If you want to subscribe for data streaming, use the Subscription.

- generated singluar name Subscription field for fetching one row

  <span style="color:red">**user**</span>(**where**: <span style="color:red">UserWhereInput!</span>): <span style="color:red">User</span>

- generated plural name Subscription field for fetching all row on some query condition:

  <span style="color:red">**users**</span>(**limit**: Int, **start**: Int, **where**: JSON, **order**: <span style="color:red">UserOrderInput</span>)

### Automatically Generated Mutations:

- Creation

  <span style="color:red">**_createUser_**</span>(input: <span style="color:red">UserCreationInput!</span>): <span style="color:red">User</span>

- Update:

  <span style="color:red">**_updateUser_**</span>(where: UserWhereInput!, input: <span style="color:red">UserUpdateInput!</span>): <span style="color:red">User</span>

- Delete:

  <span style="color:red">**_deleteUser_**</span>(where: <span style="color:red">UserWhereInput!</span>): <span style="color:red">User</span>

## Sequelize ORM

The Zeroconf also uses sequelize orm in its core and has operatorAliases for complex where clauses like below.

Sequlize Doc: [http://docs.sequelizejs.com/manual/querying.html#where](http://docs.sequelizejs.com/manual/querying.html#where)

```graphql

query {
  users(
    where: {
      or: [{ user_id: 1, user_id: 2 }]
    }
  ) {
    user_id
    email
  }
}
```

## Set the sequelize your own operators option

As we mentioned before that zeroconf contains node sequelize. You can use other options for sequelize to initialize. After clone the repository zeroconf_template and open the file `.sequelize.cfg.js`. Edit options and add more you needed. If you want to know more options on sequelize, please refer to the link below to set up other options.

Sequlize Doc: [http://docs.sequelizejs.com/manual/querying.html#operators-aliases](http://docs.sequelizejs.com/manual/querying.html#operators-aliases)

```javascript
// The default contained operatorsAliases.

const operatorsAliases = {
  eq: Op.eq,
  ne: Op.ne,
  gte: Op.gte,
  gt: Op.gt,
  lte: Op.lte,
  lt: Op.lt,
  not: Op.not,
  in: Op.in,
  notIn: Op.notIn,
  is: Op.is,
  like: Op.like,
  notLike: Op.notLike,
  iLike: Op.iLike,
  notILike: Op.notILike,
  regexp: Op.regexp,
  notRegexp: Op.notRegexp,
  iRegexp: Op.iRegexp,
  notIRegexp: Op.notIRegexp,
  between: Op.between,
  notBetween: Op.notBetween,
  overlap: Op.overlap,
  contains: Op.contains,
  contained: Op.contained,
  adjacent: Op.adjacent,
  strictLeft: Op.strictLeft,
  strictRight: Op.strictRight,
  noExtendRight: Op.noExtendRight,
  noExtendLeft: Op.noExtendLeft,
  and: Op.and,
  or: Op.or,
  any: Op.any,
  all: Op.all,
  values: Op.values,
  col: Op.col
};
```

Sequelize deprecated this operatorsAliases option. If you don't want to use operatorsAliases for security reasons. You can turn off the option.
Please open ```.sequelize.cfg.js``` in project root.

```javascript
module.exports = {
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  option: {
    operatorsAliases: false, // <-- Add: turn off the alias on where clauses
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    port: process.env.MYSQL_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    additional: {
      timestamps: false
    },
  },
};
```
### Child Relations

If table has the column id and it has foreign key which refers to the other tables.
zeroconf generates sub-fields for graph query.

```
# The bond table
bond
| id
| contract_num
| loan_request_id -> foreign key refers to the loan_request table
| ....more

# The loan_request table
loan_request
| id -> referred from foreign key bond.loan_request_id of bond table
| user_id
| ....more

# Since bond table has a foreign key loan_request_id which refers to the loan_request table, loanRequest and loanRequests will be generated.

type Bond {
  id
  -> loanRequest # generated by checking foreign key
  -> loanRequests # generated by checking foreign key
}

# So you can query like below.

query {
  bonds {
    id
    contract_num
    loanRequest {
      user_id
    }
  	loanRequests {
      user_id
    }
  }
}

# And you can see the result of a query like below.
{
  "data": {
    "bonds": [
      {
        "id": "246",
        "contract_num": "0000246-20181116",
        "loanRequest": {
          "user_id": 4897
        },
        "loanRequests": [
          {
            "user_id": 4897
          }
        ]
      },
      {
        "id": "247",
        "contract_num": "0000247-20181126",
        "loanRequest": null,
        "loanRequests": []
      },
      ...more
    ]
  }
}
```

## Extends the Cloud Code

Zeroconf does not use GraphQLObjectType to extends Graphql Object to avoid error that "Error: Cannot use GraphQLSchema "[object Object]" from another module or realm."

So we can support simplest way to extends on your existing object.

### Extends Types

#### Query

``` javascript
// clouds/extends/Query/customField.js
module.exports = {
  type: "Query",
  field: "customField",
  returnType: "[User]",
  args: {
    age: 'Int!',
  },
  resolver: async (parent, args, context, info) => {
    const { models } = context;
    const { age } = args;

    const result = await models.user.fineAll({
      where: {
        age
      }
    });

    return result;
  }
};
```

#### Mutation

``` javascript
// clouds/extends/Mutation/signIn.js
module.exports = {
  type: 'Mutation',
  field: 'signIn',
  returnType: 'User', // return a user(not array only object)
  args: {
    email: 'String!',
    password: 'String!',
  },
  resolver: async (parent, args, context, info) => {
    const { models } = context;
    const { email, password } = args;

    // todo
    // return user;
  },
};

```

#### The other objects


```javascript
import { Op } from 'sequelize';
import { dataLoader } from 'zeroconf';

module.exports = {
  type: 'User',
  field: 'friends',
  returnType: '[Friend]',
  resolver: async (parent, args, context, info) => {
    // todo
  },
};
```

Also you can query with facebook data loader with more simply way.

```javascript
import { Op } from 'sequelize';
import { dataLoader } from 'zeroconf';

module.exports = {
  type: 'User',
  field: 'friends',
  returnType: '[Friend]',
  resolver: async (parent, args, context, info) => {
    const isFindOne = false; // findAll
    const targetKey = 'user_id';
    const sourceKey = 'user_id';
    const sourceVal = parent[sourceKey];
    const modelName = 'users_friends';

    const loader = dataLoader.query(context, modelName, async (values) => {
      const { models } = context;
      const result = await models[modelName].findAll({
        where: {
          [targetKey]: {
            [Op.in]: values,
          },
        },
      });

      return dataLoader.groupBy(result, values, targetKey, isFindOne);
    });

    return loader.load(sourceVal);
  },
};
```

### Hooks

#### before hook

``` javascript
// clouds/hooks/User/beforeCreateUser.js
module.exports = {
  type: 'Mutation',
  name: 'createUser',
  when: 'before',
  hook: async (parent, args, context, hook) => {
    // todo
  },
};
```

#### after hook
``` javascript
// clouds/hooks/User/afterCreateUser.js
module.exports = {
  type: 'Mutation',
  name: 'createUser',
  when: 'after',
  hook: async (parent, args, context, hook) => {
    // todo
  },
};
```

### hook example

``` javascript
// clouds/hooks/User/beforeCreateUser.js
import uuidv1 'uuid/v1';
import { createPassword } '../../../libs/password';

module.exports = {
  type: 'Mutation',
  name: 'createUser',
  when: 'before',
  hook: async (parent, args, context, hook) => {
    const {
      input: { password, email },
    } = args;
    const created = await createPassword(password, process.env.PASSWORD_SALT);

    args.input.password = created.pw;
    args.input.uuid = uuidv1();

    return args;
  },
};
```

``` javascript
// clouds/hooks/User/afterCreateUser.js
import uuidv1 'uuid/v1';
import { sendMail } '../../../libs/sendMail';

module.exports = {
  type: 'Mutation',
  name: 'createUser',
  when: 'after',
  hook: async (parent, args, context, hook) => {

    sendMail('welcome to zeroconf!')
  },
};
```

### Custom Types

``` javascript
// clouds/types/File.js
module.exports = {
  name: 'File',
  fields: {
    filename: { type: 'String!' },
    mimetype: { type: 'String!' },
    encoding: { type: 'String!' },
  },
};
```

``` javascript
// clouds/types/Dog.js
module.exports = {
  name: "Dog",
  fields: {
    age: {
      type: 'Int!',
      description: "age",
    },
    weight: {
      type: 'String!',
      description: "weight"
    },
    color: {
      type: 'String',
      description: "color"
    },
  }
};
```