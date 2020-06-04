module.exports = function (schema) {
  schema.virtual('getHeaderTitle').get(function () {
    const company = this.viewLocals.body.datalayer.service.nameCase
    const currentStatus = this.viewLocals.body.datalayer.service.status

    if(currentStatus === null){
      return this.viewLocals.body.datalayer.homepageView.header

    } else if(currentStatus === 0){
      const notDownStr = this.viewLocals.body.datalayer.serviceView.header.notDown
      return eval('`' + notDownStr + '`');

    } else if(currentStatus === 0.5) {
      const maybeDownStr = this.viewLocals.body.datalayer.serviceView.header.maybeDown
      return eval('`' + maybeDownStr + '`');

    } else{
      const isDownStr = this.viewLocals.body.datalayer.serviceView.header.isDown
      return eval('`' + isDownStr + '`');

    }
    
  })
}
