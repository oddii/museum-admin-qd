import Mock from 'mockjs'
import relicMock from './relicMock'
// import recordMock from './recordMock'
// import userMock from './userMock'

const mocks = [
  ...relicMock
  // ...userMock
  // ...recordMock
]

for (const i in mocks) {
  Mock.mock(i.url, i.type, function () {
    return mocks[i].data
  })
}

// for (let i = 0, len = mocks.length; i < len; i++) {
//   Mock.mock(mocks[i].url, mocks[i].type, function () {
//     return mocks[i].data
//   })
// }
