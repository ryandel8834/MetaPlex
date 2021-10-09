import {
  Commitment,
  Connection,
  GetProgramAccountsConfig,
} from '@solana/web3.js';
import { StringPublicKey } from './ids';
import { AccountAndPubkey, AccountInfoOwnerString } from './types';

export async function getProgramAccounts(
  connection: Connection,
  programId: StringPublicKey,
  configOrCommitment?: GetProgramAccountsConfig | Commitment,
): Promise<Array<AccountAndPubkey>> {
  const extra: any = {};
  let commitment;
  let encoding;

  if (configOrCommitment) {
    if (typeof configOrCommitment === 'string') {
      commitment = configOrCommitment;
    } else {
      commitment = configOrCommitment.commitment;
      encoding = configOrCommitment.encoding;

      if (configOrCommitment.dataSlice) {
        extra.dataSlice = configOrCommitment.dataSlice;
      }

      if (configOrCommitment.filters) {
        extra.filters = configOrCommitment.filters;
      }
    }
  }

  const args = connection._buildArgs(
    [programId],
    commitment,
    encoding || 'base64',
    extra,
  );
  const unsafeRes = await (connection as any)._rpcRequest(
    'getProgramAccounts',
    args,
  );
  return unsafeResAccounts(unsafeRes.result);
}

export async function getTokenAccountsByOwner(
  connection: Connection,
  ownerAddress: StringPublicKey,
  filter:
    | {
        mint: StringPublicKey;
      }
    | {
        programId: StringPublicKey;
      },
  commitment?: Commitment,
) {
  const _args: any[] = [ownerAddress];

  if ('mint' in filter) {
    _args.push({
      mint: filter.mint, // StringPublicKey
    });
  } else {
    _args.push({
      programId: filter.programId, // StringPublicKey
    });
  }

  const args = connection._buildArgs(_args, commitment, 'base64');

  const unsafeRes = await (connection as any)._rpcRequest(
    'getTokenAccountsByOwner',
    args,
  );

  return unsafeResAccounts(unsafeRes.result.value);
}

export async function getAccountInfoAndContext(
  connection: Connection,
  publicKey: StringPublicKey,
  commitment?: Commitment,
) {
  const args = connection._buildArgs([publicKey], commitment, 'base64');

  const unsafeRes = await (connection as any)._rpcRequest(
    'getAccountInfo',
    args,
  );

  return unsafeAccount(unsafeRes.result.value);
}

export function unsafeAccount(
  account: AccountInfoOwnerString<[string, string]>,
): AccountInfoOwnerString<Buffer> {
  return {
    data: Buffer.from(account.data[0], 'base64'),
    executable: account.executable,
    lamports: account.lamports,
    owner: account.owner,
  };
}

export function unsafeResAccounts(
  data: Array<{
    account: AccountInfoOwnerString<[string, string]>;
    pubkey: string;
  }>,
) {
  return data.map(item => ({
    account: unsafeAccount(item.account),
    pubkey: item.pubkey,
  }));
}
