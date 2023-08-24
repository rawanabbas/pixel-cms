import chai from 'chai'
import chaiHttp from 'chai-http'
import chaiLike from 'chai-like'
import chaiThings from 'chai-things'
import { execSync } from 'child_process'

chai.use(chaiHttp)
chai.use(chaiLike)
chai.use(chaiThings)

before(async function () {
  this.timeout(10000)

  // Refresh spec and routes.
  console.log(execSync('pnpm run generate').toString('utf8'))

})