const { oneOf, strictEqual } = require('@dr-js/core/library/common/verify.js')
const { readJSON, writeJSON } = require('@dr-js/core/library/node/fs/File.js')
const { resetDirectory } = require('@dr-js/core/library/node/fs/Directory.js')
const { compressAutoAsync, extractAutoAsync } = require('@dr-js/core/library/node/module/Archive/archive.js')
const { runSync } = require('@dr-js/core/library/node/run.js')
const { runKit } = require('@dr-js/core/library/node/kit.js')

// ## export-v1-mkt-official.20211207.js ##
// run with (append `EXPORT_V1_DEBUG=true ` to reset existing db data)
//   `npx @dr-js/core@0.4 -I export-v1-mkt-official.20211207.js -e export`
//   `npx @dr-js/core@0.4 -I export-v1-mkt-official.20211207.js -e import` // will error on exist db data
//   `npx @dr-js/core@0.4 -I export-v1-mkt-official.20211207.js -e import {export-id}` // will error on exist db data

const MARKET_TEMPLATE_CID_LIST = [
  // MarketTemplate.valid.where(project_type: 'prototype').where.not(category: 'project_basic', official: false).size
  // => 159
  'mtk4s6t4k1rk5jol', 'mtk4s6t4rjuy1bbf', 'mtk4s6t59c4eo9fq', 'mtk4s6t5phopwxsl', 'mtk4s6t61fej3v17', 'mtk4s6t6dz4fo7km', 'mtk4s6t6r2l53lsn', 'mtk4s6t7qde614e1', 'mtk4s6t822hd6wge', 'mtk4s6t8ahn3cv5e',
  'mtk4s6t8gp1dlatc', 'mtk4s6t9oenc7y99', 'mtk4s6tax2zq338p', 'mtk4s6tb4b4c3tcs', 'mtk4s6tbb4x6ehph', 'mtk4s6tbkbat2ulk', 'mtk4s6tbr48jjzgs', 'mtk4s6tcnbb6bv3p', 'mtk4s6tcv9ftrj7o', 'mtk4s6td5k7ehsrd',
  'mtk4s6tdguq55q2x', 'mtk4s6tdpprbf3vr', 'mtk4s6te0a5t9kjn', 'mtk4s6teatmfmvxn', 'mtk4s6tfax5blgx9', 'mtk4s6tixqjjd12', 'mtk4s6tj6wi6e4wn', 'mtk4s6tjhp4bjl55', 'mtk4s6tjsyy8pi92', 'mtk4s6tk8tblle1t',
  'mtk4s6tkm7vl5oj8', 'mtk4s6tl2nexm9lr', 'mtk4s6tl9tohf01j', 'mtk4s6tltx64g35r', 'mtk4s6tm53x9lddt', 'mtk4s6tmciidvya6', 'mtk4s6tmmqedt3o3', 'mtk4s6tn56o6ph8a', 'mtk4s6tnpu2wjeno', 'mtk4s6to75qdu78l',
  'mtk4s6tog6e49myk', 'mtk4s6tonk7i43ty', 'mtk4s6tpu1tkzb3k', 'mtk4s6tqghos5zlx', 'mtk4s6trbba1s9e4', 'mtk4s6tro3wncexo', 'mtk4s6ts5nk45op9', 'mtk4s6tsiqfw31q2', 'mtk4s6tstihx3kv', 'mtk4s6ttaa6zwrn2',
  'mtk4s6ttnvdl9ubj', 'mtk4s6ttxzjd7xwu', 'mtk4s6tu9ngo0rcj', 'mtk4s6tufxyzsezf', 'mtk4y5qkbmyui3x8', 'mtk4y5wqh6wzv1n3', 'mtk54ioh043eenj1', 'mtk54iprhizzwlk', 'mtk54iqnksgsfnui', 'mtk54is39wb1v0yg',
  'mtk54iu32vufn7i3', 'mtk54ivcy4r00qiq', 'mtk54iwifsrwxbgw', 'mtk54ixngqmjuyy2', 'mtk54iywizhit4un', 'mtk54j03gkm99psv', 'mtk54j18n9mi8r76', 'mtk54j23s3wctitk', 'mtk54j32pdrxizq2', 'mtk54j3uyvmxf2px',
  'mtk54j5im4tn5ul7', 'mtk54j72sv3tp268', 'mtk54j8agurrw2kd', 'mtk54j98r9t1oyzq', 'mtk54jfl1rw5cc5j', 'mtk54jiogz4z2izg', 'mtk54jjig7f3w6r3', 'mtk54jlmjvob4pct', 'mtk54jmwvbcn0qvl', 'mtk54jo1x1k0w0ef',
  'mtk54jorsypxdogj', 'mtk54jpqchgt5pr9', 'mtk54jqf5dnke753', 'mtk54jrcto2a9782', 'mtk54jsrjusd7f0r', 'mtk54jvf7fmqnc7g', 'mtk56g23n5h3u7nk', 'mtk6j03rdlm6sisl', 'mtk6j070kohxz9a7', 'mtk6j0anuym6lkkp',
  'mtk6j0g274qpjp7x', 'mtk6j0kvfllkqmap', 'mtk6lnewpp7b5x00', 'mtk6lnxh00wgcu8u', 'mtk6rlplweam7blq', 'mtk6rlt9u4p7hmtf', 'mtk6rlvslvgwvwvz', 'mtk6rlzk9qr9vhcc', 'mtk6rme5m7xzcdeb', 'mtk6rmg2yv8mfa9t',
  'mtk6rmi6a44ado2v', 'mtk6rmlyhrkiy98h', 'mtk6rmoegjuy3jqg', 'mtk6rmq9a5jc4q79', 'mtk6rms2v97by98q', 'mtk7mt4yu8djwhd9', 'mtk7mt9947wwipa2', 'mtk7mtcssyhtmesa', 'mtk7mtq58izz3teo', 'mtk7y1os4bhhtpy0',
  'mtk8897jfxjhw52n', 'mtk8k24g1i3lv0h1', 'mtk8k2c3ehdarglu', 'mtk8k2faf5tlv3zq', 'mtk8k2idue3lh8x5', 'mtk8k2jpzp2vhgpk', 'mtk8k2l753p1m1ha', 'mtk8k2nht4kugm92', 'mtk8k2p1jziy6o7u', 'mtk8r4iidwa91ccu',
  'mtk8r4n4h1bec3yu', 'mtk92965yxdvwb3g', 'mtk9b0z2zw5vezru', 'mtk9b19c2aw0txc7', 'mtk9b1e1ji3hjc9l', 'mtk9jiro6giky1oa', 'mtk9jjnumxuad6yc', 'mtka6770qgnywy5l', 'mtka67jr1v808og1', 'mtkaer1w1pjm7ist',
  'mtkaer9066yfx15m', 'mtkc32kct6yqsfkf', 'mtkc32xraihahnkg', 'mtkc33rwf8yjgahd', 'mtkc33x51uq24mx', 'mtkc5ydbezd1bbck', 'mtkc5yha0af7o2jp', 'mtkc5zgmk0p6ihc7', 'mtkc5zphvgbjz33n', 'mtkc608a4k7xr0i2',
  'mtkc60e8qlztb6rr', 'mtkc60j9zrzn3u7f', 'mtkcq42boxoh09cu', 'mtki002yoszjyxej', 'mtki00v07d6lrvke', 'mtki0106yqmswq36', 'mtki01v3t7sv4fqv', 'mtki01z8njfax5ha', 'mtki026w64jh2esk', 'mtki03e4384ossnz',
  'mtki03rbk1qwhipm', 'mtkkdm1vmq1ka02n', 'mtkkdm2i7g30ikgp', 'mtkkdm34oy5milpb', 'mtkkdm3p13plfhzk', 'mtkkdm49msepvk8g', 'mtkszn502sg7qgc', 'mtkw1wkrhtbkitz6', 'mtkwotn0satglvin'
]
const EXPORT_TAG = `mkt-official-${MARKET_TEMPLATE_CID_LIST.length}`

const [ // NOTE: local scope, injected value
  MODE,
  EXPORT_ID = `e-batch-${EXPORT_TAG}`
] = evalArgv // eslint-disable-line no-undef
oneOf(MODE, [ 'export', 'import' ])

runKit(async (kit) => {
  const exportConfigFile = kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}/.batch-config.json`)

  if (MODE === 'export') {
    kit.padLog('reset output path')
    await resetDirectory(kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}/`))

    kit.padLog('create config file')
    await writeJSON(exportConfigFile, {
      exportId: EXPORT_ID,
      exportSubIdUpperTypeUpperCidListList: MARKET_TEMPLATE_CID_LIST.map((cid) => [ `e-${cid}`, 'market-template', cid ]) // exportSubId, upperType, upperCid
    })

    kit.padLog(`export ${MARKET_TEMPLATE_CID_LIST.length} MarketTemplate`)
    runSync([ 'node', kit.fromRoot('platter-gitignore.js'), 'jc-chalice-export-v1', 'batch:project-upper', exportConfigFile ])

    kit.padLog('pack output')
    await compressAutoAsync(kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}/`), kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}.tgz`))
    kit.log('output file:', kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}.tgz`))
  }

  if (MODE === 'import') {
    kit.padLog('unpack output')
    await extractAutoAsync(kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}.tgz`), kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}/`))
    kit.log('output path:', kit.fromRoot(`exchange-gitignore/export/${EXPORT_ID}/`))

    kit.padLog('check config')
    const { exportId: exportIdPack, exportSubIdUpperTypeUpperCidListList } = await readJSON(exportConfigFile)
    strictEqual(exportIdPack, EXPORT_ID, 'exportId should match pack config')

    kit.padLog(`import ${exportSubIdUpperTypeUpperCidListList.length} MarketTemplate`)
    runSync([ 'node', kit.fromRoot('platter-gitignore.js'), 'jc-chalice-import-v1', 'batch:project-upper', exportConfigFile ])

    kit.padLog('update db index')
    runSync([ 'node', kit.fromRoot('platter-gitignore.js'), 'jc-imock-app-db-update' ])
  }
}, { title: `export-v1-${EXPORT_TAG}`, PATH_ROOT: '/mnt/mb/deploy/' })

