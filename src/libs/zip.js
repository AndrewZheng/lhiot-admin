/* eslint-disable */
// npm install file-saver --save
// npm install script-loader --save-dev
// npm install jszip
require('script-loader!file-saver');
import JSZip from 'jszip'

export const export_txt_to_zip = ({th, jsonData, txtName, zipName}) => {
  const zip = new JSZip()
  const txt_name = txtName || 'file'
  const zip_name = zipName || 'file'
  const data = jsonData
  let txtData = `${th}\r\n`
  data.forEach((row) => {
      let tempStr = ''
      tempStr = row.toString()
      txtData += `${tempStr}\r\n`
  })
  zip.file(`${txt_name}.txt`, txtData)
  zip.generateAsync({
      type: "blob"
  }).then((blob) => {
      saveAs(blob, `${zip_name}.zip`)
  }, (err) => {
      alert('导出失败')
  })
}

export default {
  export_txt_to_zip
}
