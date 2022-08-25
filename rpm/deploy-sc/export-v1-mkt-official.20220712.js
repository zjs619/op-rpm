const { resolve } = require('path')
const { oneOf, strictEqual } = require('@dr-js/core/library/common/verify.js')
const { existPathSync } = require('@dr-js/core/library/node/fs/Path.js')
const { readJSON, writeJSON } = require('@dr-js/core/library/node/fs/File.js')
const { resetDirectory } = require('@dr-js/core/library/node/fs/Directory.js')
const { compressAutoAsync, extractAutoAsync } = require('@dr-js/core/library/node/module/Archive/archive.js')
const { runSync } = require('@dr-js/core/library/node/run.js')
const { runKit } = require('@dr-js/core/library/node/kit.js')

// ## export-v1-mkt-official.20220712.js ##
// run with (append `EXPORT_V1_DEBUG=true ` to reset existing db data)
//   `npx @dr-js/core@0.5 -I export-v1-mkt-official.20220712.js -e export`
//   `npx @dr-js/core@0.5 -I export-v1-mkt-official.20220712.js -e import` // will error on exist db data
//   `npx @dr-js/core@0.5 -I export-v1-mkt-official.20220712.js -e import {export-id}` // will error on exist db data

// MarketTemplate.where(user_id: 1472512, deleted: false, state: 'approved', project_type: 'prototype').where.not(category: 'project_basic').pluck(:cid).join(',')
const MARKET_TEMPLATE_CID_LIST = 'mtk4s6t4k1rk5jol,mtk4s6t4rjuy1bbf,mtk4s6t59c4eo9fq,mtk4s6t5i87lmg3v,mtk4s6t5phopwxsl,mtk4s6t61fej3v17,mtk4s6t6dz4fo7km,mtk4s6t6r2l53lsn,mtk4s6t7qde614e1,mtk4s6t822hd6wge,mtk4s6t8ahn3cv5e,mtk4s6t8gp1dlatc,mtk4s6t9oenc7y99,mtk4s6tax2zq338p,mtk4s6tb4b4c3tcs,mtk4s6tbb4x6ehph,mtk4s6tbkbat2ulk,mtk4s6tbr48jjzgs,mtk4s6tc3sx7auzn,mtk4s6tcnbb6bv3p,mtk4s6tcv9ftrj7o,mtk4s6td5k7ehsrd,mtk4s6tdguq55q2x,mtk4s6tdpprbf3vr,mtk4s6te0a5t9kjn,mtk4s6teatmfmvxn,mtk4s6tfax5blgx9,mtk4s6tixqjjd12,mtk4s6tj6wi6e4wn,mtk4s6tjhp4bjl55,mtk4s6tjsyy8pi92,mtk4s6tk8tblle1t,mtk4s6tkm7vl5oj8,mtk4s6tl2nexm9lr,mtk4s6tl9tohf01j,mtk4s6tltx64g35r,mtk4s6tm53x9lddt,mtk4s6tmciidvya6,mtk4s6tmmqedt3o3,mtk4s6tn56o6ph8a,mtk4s6tnpu2wjeno,mtk4s6to75qdu78l,mtk4s6tog6e49myk,mtk4s6tonk7i43ty,mtk4s6tpu1tkzb3k,mtk4s6tqghos5zlx,mtk4s6trbba1s9e4,mtk4s6tro3wncexo,mtk4s6ts5nk45op9,mtk4s6tsiqfw31q2,mtk4s6tstihx3kv,mtk4s6ttaa6zwrn2,mtk4s6ttnvdl9ubj,mtk4s6ttxzjd7xwu,mtk4s6tu9ngo0rcj,mtk4s6tufxyzsezf,mtk4y5qkbmyui3x8,mtk4y5wqh6wzv1n3,mtk54ioh043eenj1,mtk54iprhizzwlk,mtk54iqnksgsfnui,mtk54is39wb1v0yg,mtk54iu32vufn7i3,mtk54ivcy4r00qiq,mtk54iwifsrwxbgw,mtk54ixngqmjuyy2,mtk54iywizhit4un,mtk54j03gkm99psv,mtk54j18n9mi8r76,mtk54j23s3wctitk,mtk54j32pdrxizq2,mtk54j3uyvmxf2px,mtk54j5im4tn5ul7,mtk54j72sv3tp268,mtk54j8agurrw2kd,mtk54j98r9t1oyzq,mtk54jfl1rw5cc5j,mtk54jiogz4z2izg,mtk54jjig7f3w6r3,mtk54jlmjvob4pct,mtk54jmwvbcn0qvl,mtk54jo1x1k0w0ef,mtk54jorsypxdogj,mtk54jpqchgt5pr9,mtk54jqf5dnke753,mtk54jrcto2a9782,mtk54jsrjusd7f0r,mtk54jumcfa61uk2,mtk54jvf7fmqnc7g,mtk54jwoukt1wivn,mtk56g23n5h3u7nk,mtk6j03rdlm6sisl,mtk6j070kohxz9a7,mtk6j0anuym6lkkp,mtk6j0g274qpjp7x,mtk6j0kvfllkqmap,mtk6lnewpp7b5x00,mtk6lnxh00wgcu8u,mtk6rlplweam7blq,mtk6rlt9u4p7hmtf,mtk6rlvslvgwvwvz,mtk6rlzk9qr9vhcc,mtk6rme5m7xzcdeb,mtk6rmg2yv8mfa9t,mtk6rmi6a44ado2v,mtk6rmlyhrkiy98h,mtk6rmoegjuy3jqg,mtk6rmq9a5jc4q79,mtk6rms2v97by98q,mtk7mt4yu8djwhd9,mtk7mt9947wwipa2,mtk7mtcssyhtmesa,mtk7mtq58izz3teo,mtk7y1os4bhhtpy0,mtk8897jfxjhw52n,mtk8k24g1i3lv0h1,mtk8k2c3ehdarglu,mtk8k2faf5tlv3zq,mtk8k2idue3lh8x5,mtk8k2jpzp2vhgpk,mtk8k2l753p1m1ha,mtk8k2nht4kugm92,mtk8k2p1jziy6o7u,mtk8r4iidwa91ccu,mtk8r4n4h1bec3yu,mtk92965yxdvwb3g,mtk9b0z2zw5vezru,mtk9b19c2aw0txc7,mtk9b1e1ji3hjc9l,mtk9jiro6giky1oa,mtk9jjnumxuad6yc,mtka6770qgnywy5l,mtka67jr1v808og1,mtkaer1w1pjm7ist,mtkaer9066yfx15m,mtkc32kct6yqsfkf,mtkc32xraihahnkg,mtkc33rwf8yjgahd,mtkc33x51uq24mx,mtkc5ydbezd1bbck,mtkc5yha0af7o2jp,mtkc5zgmk0p6ihc7,mtkc5zphvgbjz33n,mtkc608a4k7xr0i2,mtkc60e8qlztb6rr,mtkc60j9zrzn3u7f,mtkcq42boxoh09cu,mtki002yoszjyxej,mtki00v07d6lrvke,mtki0106yqmswq36,mtki01v3t7sv4fqv,mtki01z8njfax5ha,mtki026w64jh2esk,mtki03e4384ossnz,mtki03rbk1qwhipm,mtkkdm1vmq1ka02n,mtkkdm2i7g30ikgp,mtkkdm34oy5milpb,mtkkdm3p13plfhzk,mtkkdm49msepvk8g,mtkkgpqmkqyp7ynj,mtkkgpt21mk21qtr,mtkkgpu9wpikift2,mtkkgpwpo41fhbey,mtkszn502sg7qgc,mtkw1wkrhtbkitz6,mtkwotn0satglvin,mtkx9r9hvs2qa6fu,mtkx9rjp8hlakhbr,mtkx9rlree523lwr,mtkx9rnqqh4zmj71,mtkx9rpybwhir0d2,mtkx9ru2w47d34hh,mtkx9rwkwpmrhg45,mtkx9ryf9zx56evr,mtkx9s6b7m7fl8us,mtkx9s80auknhh2o,mtkxh5w1petxeeg7,mtkxh5yjsp5tmrc7,mtkxh60dwmmxu68r,mtkxh61s2byqy3qv,mtkxh634unurm77w,mtkxh648symd879g,mtkxh6580fb3xzll,mtkxh669dh4rqn6x,mtkxh6761h3oj2l4,mtkxh68eh26m40de,mtkxh69dvy829cb3,mtkxh6a6vk1tzpzj,mtkxh6b5urjucd3e,mtkxh6d88lp5ympz,mtkxh6e46y7qa9qe,mtkxh6ez768s6f23,mtkxh6fuh7zyz7ht,mtkxh6hawigt14fh,mtkxh6i8udqm8uzo,mtkxh6kj465e5nd4,mtkxh6lmgln569r5,mtkxh6mef11ntwvo,mtkxh6nc0i97l64n,mtkxh6oc31c5vhh7,mtkxh6p9fet1b5es,mtkxh6q4vm4ygy6b,mtkxh6r7liw437i7,mtkxh6s9sixcn1kg,mtkxh6tczyzs5dw,mtl0uvnwznt09glk,mtl0w8j3up6efgpu,mtl0w8lf1ysvlf54,mtl0w8nn5ktlsbxk,mtl0w8o984d2n8m,mtl0w8ov52zdew7a,mtl0w8pffp40at7b,mtl0w8pzm2x53i7z,mtl0w8qtc7tilcdi,mtl0w8s7tvzte8ix,mtl11xe4fvhd3oir,mtl11y6vqc478nwc,mtl11ybcm358t1dq,mtl121jwze5ph1ap,mtl122nvzyb55akn,mtl123h3eg5emse1,mtl2eevw55atfiu9,mtl2flc1not717o0,mtl2flfnh5v4yr78,mtl2fli209tjyr51,mtl2flk4znxa6mug,mtl2flrlr3yqers3,mtl2fxplot1ff8ox,mtl2gy3pwu7bnm0f,mtl2gycnqi56ozbb,mtl2gyjbrcqlpy1j,mtl2gyl6k5wz9lom,mtl2gz4emzoewby,mtl2gzf4eflr0hkg,mtl2gzirf3wixe21,mtl2gzln1ex6awtf,mtl2gzoxpea1415o,mtl2gzsc7o9y5q9d,mtl2gzug7zytusa4,mtl2gzxhiqw0s5o0,mtl2h5misznern66,mtl2h5oc4hods875,mtl2h7aicbszl0to,mtl2h7lug676lowr,mtl2h7nvk56bzchl,mtl2h7pj8j5hmxif,mtl2k3absa4vjyip,mtl2va1ja93gfgaz,mtl2w024c46x49sy,mtl2w0809ocu0me0,mtl2w0cjr87qia77,mtl2w0htc2o16qop,mtl2w0l0ww3ivfkz,mtl2w0nyu9a4555o,mtl2w0r9a8cq7hy,mtl2w0u8udq1csj0,mtl2w0wszjzvbeth,mtl2w11dicjfrgaw,mtl2w14t0aradqlf,mtl2w17mrfw4fep,mtl2w1baqo2c62jt,mtl2w1dugaml1is9,mtl32zmld4ilznm0,mtl32zrfvdrerjtv,mtl32zxmpmotsnu3,mtl33013khwwoqd0,mtl331a3n71rphja,mtl331fyheipf0wu,mtl331kkuyvs4ls9,mtl331pc2qztxecb,mtl331smigwyw281,mtl331ypkt72gav4,mtl3322cxtzquuq1,mtl3327otftqfhuk,mtl332ccsb4wyvry,mtl332ha86sxtxpp,mtl332m31s2mabte,mtl332q2r7xuj9vj,mtl332u96p680rkh,mtl332zei5qqijry,mtl34e1bueifhdld,mtl34e4exhdy035h,mtl34e6pjsm2l3dd,mtl34e8sksyqsbc6,mtl34eeu9zq3vh89,mtl34esrv7aceiai,mtl34euff5tlhf12,mtl34ewrz5ju6luz,mtl34f05o3skbwhr,mtl34f2bkei6o4ha,mtl34f4fl184xr2g,mtl34frfwrgqvkjo,mtl34fw4cvz9n0mi,mtl34fxt02669ul,mtl34fzqljpw54pv,mtl34g2lf7fgihoq,mtl34g4hpurppsys,mtl34g6lsiwy5swo,mtl3v635d7wtgq75,mtl3vd2nok3sxzdh,mtl486i14562v4cu,mtl486k0yspg1v2z,mtl486m4t1bcs5p6,mtl486nl85fv6ffa,mtl486q63y3jhahx,mtl4872woewkrtcq,mtl4874m2yfdpbq5,mtl4f8r5zpju1kk6,mtl4f9r7zas69tzv,mtl4f9y5hu46hbyz,mtl4fa5t8uexzgm7,mtl4fb1gntvvwfzq,mtl4fbzn6ikn0554,mtl4p01tuermbgj0,mtl4p0nsf6ukwkf4,mtl4p1444afgkuld,mtl4p1cvgh4fnmd1,mtl4p1l4hc7s34jx,mtl4p1u041we2czz,mtl4pf3kmxmcv0t3,mtl4pfb4nyec95sh,mtl4pfjc2q5poh8j'
  .split(',')
const EXPORT_TAG = `mkt-official-${MARKET_TEMPLATE_CID_LIST.length}`

const PLATTER = 'platter-gitignore.js'

const [ // NOTE: local scope, injected value
  MODE,
  EXPORT_ID = `e-batch-${EXPORT_TAG}`
] = evalArgv // eslint-disable-line no-undef
oneOf(MODE, [ 'export', 'import' ])

runKit(async (kit) => {
  const P = (...args) => runSync([ 'node', kit.fromRoot(PLATTER), ...args ])
  const fromExport = (...args) => kit.fromRoot('exchange-gitignore/export/', ...args)
  const exportConfigFile = fromExport(EXPORT_ID, '.batch-config.json')
  const exportTgzFile = fromExport(`${EXPORT_ID}.tgz`)
  const exportMain = fromExport(EXPORT_ID)

  if (MODE === 'export') {
    kit.padLog('reset output path')
    await resetDirectory(fromExport(EXPORT_ID))

    kit.padLog('create config file')
    await writeJSON(exportConfigFile, {
      exportId: EXPORT_ID,
      exportSubIdUpperTypeUpperCidListList: MARKET_TEMPLATE_CID_LIST.map((cid) => [ `e-${cid}`, 'market-template', cid ]) // exportSubId, upperType, upperCid
    })

    kit.padLog(`export ${MARKET_TEMPLATE_CID_LIST.length} MarketTemplate`)
    P('jc-chalice-export-v1', 'batch:project-upper', exportConfigFile)

    kit.padLog('pack output')
    await compressAutoAsync(exportMain, exportTgzFile)
    kit.log('output file:', exportTgzFile)
  }

  if (MODE === 'import') {
    kit.padLog('unpack output')
    await extractAutoAsync(exportTgzFile, exportMain)
    kit.log('output path:', exportMain)

    kit.padLog('check config')
    const { exportId: exportIdPack, exportSubIdUpperTypeUpperCidListList } = await readJSON(exportConfigFile)
    strictEqual(exportIdPack, EXPORT_ID, 'exportId should match pack config')

    kit.padLog(`import ${exportSubIdUpperTypeUpperCidListList.length} MarketTemplate`)
    P('jc-chalice-import-v1', 'batch:project-upper', exportConfigFile)

    kit.padLog('update db index')
    P('jc-imock-app-db-update')
  }
}, { title: `export-v1-${EXPORT_TAG}`, PATH_ROOT: existPathSync(resolve(process.cwd(), PLATTER)) ? process.cwd() : '/mnt/mb/deploy/' })
