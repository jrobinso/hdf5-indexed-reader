import {assert} from 'chai'
import {openH5File} from "../dist/hdf5-indexed-reader.node.cjs"

suite("test", function () {


    test("chromosome names", async function () {

        this.timeout(1000000)

        const config = {
            url: "https://www.dropbox.com/scl/fi/ccxmiwzc5d3sj8lfksl5h/vcf_cnv_issue1788.pytor?rlkey=73arprap9fzxwq4zidd3vddmr&dl=0"
        }

        const hdfFile = await openH5File(config)

        const chr_ds = await hdfFile.get("rd_chromosomes")
        const type = await chr_ds.dtype
        let rd_chromosomes = await chr_ds.value
        assert.equal(rd_chromosomes.length, 25)
        const names = new Set(rd_chromosomes)
        for(let i=1; i<22; i++) {
            const n = "chr" + i
            assert.ok(names.has(n))
        }
        assert.ok(names.has("chrX"))
        assert.ok(names.has("chrY"))
        assert.ok(names.has("chrM"))
     })



})
