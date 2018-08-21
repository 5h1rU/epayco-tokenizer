# epayco-tokenizer

## installation

```npm install epayco-tokenizer```

## How to use

As a Promise

```js

import Tokenizer from "epayco-tokenizer";

const tokenizer = new Tokenizer(<EPAYCO_PUBLIC_TOKEN>);

const payload = [
    {
      type: "name",
      value: "Fulano de tal"
    },
    {
      type: "email",
      value: "test@test.com"
    },
    {
      type: "number",
      value: "4575623182290326"
    },
    {
      type: "cvc",
      value: "123"
    },
    {
      type: "date_exp",
      value: "07" + "/" + "2017",
      required: !0
    }
  ];

const response = tokenizer.init(payload).then(response => ...));

```
or with async/await syntax

```js

import Tokenizer from "epayco-tokenizer";

const tokenizer = new Tokenizer(<EPAYCO_PUBLIC_TOKEN>);

const payload = [
    {
      type: "name",
      value: "Fulano de tal"
    },
    {
      type: "email",
      value: "test@test.com"
    },
    {
      type: "number",
      value: "4575623182290326"
    },
    {
      type: "cvc",
      value: "123"
    },
    {
      type: "date_exp",
      value: "07" + "/" + "2017",
      required: !0
    }
  ];

const response = await tokenizer.init(payload);

```