const fs = require('fs')
const path = require('path')
export const readFileName = (folderPath)=>{
 return   fs.readdirSync(folderPath).map(fileName => {
        return path.join(folderPath, fileName)
      })
}