import {testCNDB} from "./testCNDB.js"
import sinon from 'sinon'
import { expect } from 'chai';
import {openH5File} from "../dist/hdf5-indexed-reader.node.cjs"

suite("test", function () {


    test("cndb - indexed -- remote", async function () {

        this.timeout(100000)
        const startTime = Date.now()

        const remoteConfig = {
            url: "https://dl.dropboxusercontent.com/s/53fbs3le4a65noq/spleen_1chr1rep.indexed.cndb?dl=0"
        }

        await testCNDB(remoteConfig)

        //console.log(`cndb - indexed -- remote finished in ${Date.now() - startTime} ms`)

    })

    test("cndb - external index -- remote", async function () {

        this.timeout(100000)
        const startTime = Date.now()

        // Create HDF5 file
        const localConfig = {
            url: "https://dl.dropboxusercontent.com/s/7hmj25az1vgaejf/spleen_1chr1rep.cndb?dl=0",
            indexURL: "https://dl.dropboxusercontent.com/s/omo9fbp00ndgkv1/spleen_1chr1rep.indexed.index.json?dl=0"
        }

        await testCNDB(localConfig)

        console.log(`cndb - external index -- local finished in ${Date.now() - startTime} ms`)

    })

    test("cndb - remote -- oauth", async function () {
      // Confirm that remoteFile uses proper OAuth token in "Authorization"
      // header.  This is a regression test; previously, remoteFile passed
      // an unresolved promise as the Authorization bearer token value.

      const fetchStub = sinon.stub(global, 'fetch');

      // Arrange: Mock the fetch response
      fetchStub.resolves({
        status: 200
      });

      // Create HDF5 file
      const config = {
          url: "https://cloud.test/file-needing-authentication.h5ad",
          oauthToken: "expected-oauth-token"
      }

      try {
        await openH5File(config)
      } catch (e) {
        // This avoids the need for extensive mocking, while enabling
        // us to test remoteFile handling with fidelity and isolation.
      }

      const callArgs = fetchStub.getCall(0).args
      const actualHeaders = callArgs[1].headers
      expect(actualHeaders.Authorization).to.equal('Bearer expected-oauth-token')

      fetchStub.restore();
  })

})
