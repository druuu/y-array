
import Y from '../../yjs/src/y.js'

import yWebsockets from '../../y-websockets-client-es7/src/Websockets-client.js'
import yMemory from '../../y-memory/src/Memory.js'
import yArray from '../../y-array/src/Array.js'
import yMap from '../../y-map/src/Map.js'

Y.extend(yWebsockets, yMemory, yArray, yMap)

export default Y

export async function compareUsers (t, users) {
  await flushAll(t, users)
  var data = await Promise.all(users.map(async (u) => {
    var data = {}
    u.db.requestTransaction(function * () {
      data.os = yield * this.getOperationsUntransformed()
      data.os = data.os.untransformed.map((op) => {
        return Y.Struct[op.struct].encode(op)
      })
      data.ds = yield * this.getDeleteSet()
      data.ss = yield * this.getStateSet()
    })
    await u.db.whenTransactionsFinished()
    return data
  }))
  for (var i = 0; i < data.length - 1; i++) {
    await t.asyncGroup(async () => {
      t.compare(users[i].share.array.toArray(), users[i + 1].share.array.toArray(), 'types')
      t.compare(data[i].os, data[i + 1].os, 'os')
      t.compare(data[i].ds, data[i + 1].ds, 'ds')
      t.compare(data[i].ss, data[i + 1].ss, 'ss')
    }, `Compare user${i} with user${i + 1}`)
  }
}

export async function initArrays (t, opts) {
  var result = {
    users: []
  }
  var share = Object.assign({ flushHelper: 'Map', array: 'Array' }, opts.share)

  var connector = Object.assign({ room: 'debugging_' + t.name }, opts.connector)
  for (let i = 0; i < opts.users; i++) {
    let y = await Y({
      connector: connector,
      db: opts.db,
      share: share
    })
    result.users.push(y)
    for (let name in share) {
      result[name + i] = y.share[name]
    }
  }
  result.array0.delete(0, result.array0.length)
  await flushAll(t, result.users)
  return result
}

export async function flushAll (t, users) {
  await Promise.all(users.map(u => {
    return new Promise(function (resolve) {
      u.connector.whenSynced(resolve)
    })
  }))
  await Promise.all(users.map(u => { return u.db.whenTransactionsFinished() }))
  var flushCounter = users[0].share.flushHelper.get('0') || 0
  flushCounter++
  await Promise.all(users.map(async (u, i) => {
    u.share.flushHelper.set(i + '', flushCounter)
    // wait for all users to set the flush counter to the same value
    return await new Promise(resolve => {
      function observer () {
        var allUsersReceivedUpdate = true
        for (var i = 0; i < users.length; i++) {
          if (u.share.flushHelper.get(i + '') !== flushCounter) {
            allUsersReceivedUpdate = false
            break
          }
        }
        if (allUsersReceivedUpdate) {
          resolve()
        }
      }
      u.share.flushHelper.observe(observer)
    })
  }))
}

export function wait (t) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t || 100)
  })
}