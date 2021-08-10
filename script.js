// .
// import fs from 'fs'
//
// const pkgs = fs.readdirSync('packages')
//
// pkgs.forEach((d) => {
//   const pkg = JSON.parse(fs.readFileSync('packages/' + d + '/package.json'))
//   const {
//     name,
//     version,
//     description,
//     license,
//     keywords,
//     repository,
//     bugs,
//     funding,
//     author,
//     contributors,
//     files,
//     ...rest
//   } = pkg
//
//   const clean = {
//     name,
//     version,
//     description,
//     license,
//     keywords,
//     repository,
//     bugs,
//     funding,
//     author,
//     contributors,
//     sideEffects: false,
//     type: 'module',
//     main: 'index.js',
//     files,
//     ...rest
//   }
//
//   fs.writeFileSync(
//     'packages/' + d + '/package.json',
//     JSON.stringify(clean, null, 2) + '\n'
//   )
// })
