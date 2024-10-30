import { Wallets } from 'fabric-network';
import * as path from 'path';

async function setupIdentity() {
    const username = 'himani'; 
    const walletDirectory = path.resolve(__dirname, 'wallet'); 
    const wallet = await Wallets.newFileSystemWallet(walletDirectory);

    const identity = {
        credentials: {
            certificate: `-----BEGIN CERTIFICATE-----
MIIBjzCCATSgAwIBAgIRAMkxP/Byc+1AwLh6EYtbDZQwCgYIKoZIzj0EAwIwWDEL
MAkGA1UEBhMCVVMxDzANBgNVBAgMBkZsb3JpZDEXMBUGA1UECgwOd2FsZG9ubWVk
aWFhZ2VkMRQwEgYDVQQDDAt3b3Jrc2hvcG5hbWUwHhcNMjQwMTAyMTAxMTAwWhcN
MjQwNzA1MTAxMTAwWjBYMQswCQYDVQQGEwJVUzEPMA0GA1UECAwGRmxvcmlkYTEc
MAkGA1UECgwCZzFMMBwGA1UEAxMVaWQub3JnMS5mb3JtYXR0ZWQueHlwMRQwEgYD
VQQDDAt5b3VyaWRoZXJlMGkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE2j4y9uUD
xDFGmrwg0EYB5xl5p2Tna+fQY2QcOApPzP8FBl3Vp4c1omlVjtAfZ3tKiOdME4Fu
MwjGi4+kHSglQaNTMFEwHQYDVR0OBBYEFJtmKdG9W/F1vF1PmsdW0ckEKYQDMAkG
A1UdEwQCMAAwHQYDVR0RBBYwFIESYXBwbGljYXRpb25vbmVAYmFyY29ycDAKBggq
hkjOPQQDAgNJADBGAiEAmSTDe6lh6Ff6nmhCzLfHzbDnCb/oBRptmWj7g9h4f/0C
IQDkrXQNhjT2kv4L84eXtDCKKCTdORgtGVy6Kdwtt0Vztw==
-----END CERTIFICATE-----`,
            privateKey: `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgflzFsbJ7xu+7LmEN
FsXxXgX/jOiBTVMz7rdvqxUJODihRANCAAS0DAxzgJt2LPDPHQ0s8lnlKOc0JHVG
l1FTZxH2kA1NFJDMSLVDoPb8RP6UlSkxItXBQzN48zmvsLk3kEfOx1Xw
-----END PRIVATE KEY-----`
        },
        mspId: 'SampleMSP',
        type: 'X.509',
    };

    await wallet.put(username, identity);
    console.log(`Identity for "${username}" successfully added to the wallet.`);
}

setupIdentity().catch((error) => console.error('Error adding identity:', error));
