import { LitAbility, LitActionResource } from '@lit-protocol/auth-helpers'
import { LitNodeClient } from '@lit-protocol/lit-node-client'
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers'
import { AuthCallbackParams } from '@lit-protocol/types'
import { createEcdsaKernelAccountClient } from '@zerodev/presets'
import { providerToSmartAccountSigner } from 'permissionless'
import { polygonMumbai } from 'viem/chains'

const POLYGON_MUMBAI_RPC_URL = 'https://polygon-mumbai-pokt.nodies.app'
const PKP_PUBLIC_KEY = '0x040b482375c16c1f91501c556f698918b819b9f612460d0fae3c82ad3c74861f12a969ba1ce0454756a73b494932bc0d787400b8ac2f9ac2893658dc829f92ccb3'
const ZERODEV_PROJECT_ID = '456'

const litNodeClient = new LitNodeClient({
  litNetwork: 'cayenne',
  debug: false,
})

const resourceAbilities = [
  {
    resource: new LitActionResource('*'),
    ability: LitAbility.PKPSigning,
  },
]

/**
 * For provisioning keys and setting up authentication methods see documentation below
 * https://developer.litprotocol.com/v2/pkp/minting
 */
const authNeededCallback = async (params: AuthCallbackParams) => {
  const response = await litNodeClient.signSessionKey({
    // @ts-ignore
    sessionKey: params.sessionKeyPair,
    statement: params.statement,
    authMethods: [],
    pkpPublicKey: PKP_PUBLIC_KEY,
    expiration: params.expiration,
    resources: params.resources,
    chainId: 1,
  })
  return response.authSig
}



let kernelAddress: string | undefined = undefined


export let pkpWallet : PKPEthersWallet | undefined = undefined

export const startZeroDev = async () => {
  await litNodeClient.connect()

  const sessionSigs = await litNodeClient
    .getSessionSigs({
      chain: 'ethereum',
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // a week
      resourceAbilityRequests: resourceAbilities,
      authNeededCallback,
    })
    .catch((err) => {
      console.log('error while attempting to access session signatures: ', err)
      throw err
    })

  pkpWallet = new PKPEthersWallet({
    pkpPubKey: PKP_PUBLIC_KEY,
    rpc: POLYGON_MUMBAI_RPC_URL,
    controllerSessionSigs: sessionSigs,
  })

  // @ts-ignore
  const smartAccountSigner = await providerToSmartAccountSigner(pkpWallet)

  // Set up your Kernel client
  const kernelClient = await createEcdsaKernelAccountClient({
    chain: polygonMumbai,
    projectId: ZERODEV_PROJECT_ID,
    signer: smartAccountSigner,
  })
  kernelAddress = kernelClient.account.address

  console.log("kernet address:", kernelAddress)
}