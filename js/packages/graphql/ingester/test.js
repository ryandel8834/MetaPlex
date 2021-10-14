const { getWhitelistedCreatorList } = require('./index');

const MATRIX_MAP = [
  // result arg1 arg2
  [
    '3qJa31QsQVtMW8K4s24Xfkj6MZTsn3YoJFBtTempZEya',
    'FWra3L1Z7cNwKC69PzrwP22nFJ5k8mCVHmWaDspT5RmA',
    'G2STCnci6JeFupW77e1ywnkcGEazyEeVAvDkdZLT1P4o',
  ],
  [
    'Epy8T4MC3Hs4ykQ1ecto2Ypb7sZpfwPc4UUNUJ3ukpJe',
    '5oN3XWYiBMzzfmduwFkqAi2RaeSSjx7BQ8SYL9CBrZEA',
    'H7zEbspuWJedum4fXLMjubEmQh5Une567qtXzauitqtH',
  ],
  [
    'CHZr3okrUfFQ5L4kp6kbVjgvn8ghbvo1wRjYYorZf6Tk',
    'GgTK3LJGvNiX6Zg69u8WnonTM5WKVyG9acdkYsCFRRjv',
    'EQELCK3mMrKLwaZanubXdG62mExxw2ecNULHx45jbx8t',
  ],
  [
    '6wWpDS26zRFgmLmGrmkdFfGZFWAKvy2FwWUnCtY4jiNw',
    'A7ZpALf65d6xsB5MD5esbbC9p7CtbBznXEFZqhmkZUD6',
    '9fqKLusrhZWSzWTqtwduQKHcrVRx9e94ts9okRFDdtsg',
  ],
];
// stub for getWhitelistedCreator
//const { getWhitelistedCreator } = require('../dist/common');
async function getWhitelistedCreator(arg1, arg2) {
  const item = MATRIX_MAP.find(it => it[1] === arg1 && it[2] === arg2);
  if (!item) {
    throw new Error('Please add new stub data to MATRIX_MAP');
  }
  return item[0];
}

async function testSuite(address, storeId) {
  const creatorAddress = [address];
  const store = [storeId];
  const stream = getWhitelistedCreatorList(creatorAddress, store);
  let item;
  stream.on('data', it => {
    if (item) {
      throw new Error('invalid size');
    } else {
      item = it;
    }
  });
  await new Promise(resolve => stream.on('end', resolve));
  const res = await getWhitelistedCreator(item[4], item[3]);
  console.log(res, item[4], item[3]);
  return [res, item[0], item];
}

describe('ingester', () => {
  it('test1', async () => {
    const [js, rust] = await testSuite(
      'G2STCnci6JeFupW77e1ywnkcGEazyEeVAvDkdZLT1P4o',
      'FWra3L1Z7cNwKC69PzrwP22nFJ5k8mCVHmWaDspT5RmA',
    );
    expect(rust).toBe(js);
  });

  it('test2', async () => {
    const [js, rust] = await testSuite(
      'H7zEbspuWJedum4fXLMjubEmQh5Une567qtXzauitqtH',
      '5oN3XWYiBMzzfmduwFkqAi2RaeSSjx7BQ8SYL9CBrZEA',
    );
    expect(rust).toBe(js);
  });

  it('test3', async () => {
    const [js, rust] = await testSuite(
      'EQELCK3mMrKLwaZanubXdG62mExxw2ecNULHx45jbx8t',
      'GgTK3LJGvNiX6Zg69u8WnonTM5WKVyG9acdkYsCFRRjv',
    );
    expect(rust).toBe(js);
  });

  it('test4', async () => {
    const [js, rust] = await testSuite(
      '9fqKLusrhZWSzWTqtwduQKHcrVRx9e94ts9okRFDdtsg',
      'A7ZpALf65d6xsB5MD5esbbC9p7CtbBznXEFZqhmkZUD6',
    );
    expect(rust).toBe(js);
  });
});
