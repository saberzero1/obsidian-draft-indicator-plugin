const { Plugin } = require('obsidian')
const editClassName = 'edit-indicator'
const publishClassName = 'publish-indicator'

module.exports = class DraftIndicatorPlugin extends Plugin {
  async onload() {
    // update all files on startup or when enabling the plugin
    this.app.workspace.onLayoutReady(() => {
      this.app.vault.getMarkdownFiles().forEach((file) => this.update(file))
    })

    // update when any file metadata changes
    this.registerEvent(
      this.app.metadataCache.on('changed', (file) => this.update(file))
    )
  }

  async onunload() {
    // clean up the css classes
    this.app.vault.getMarkdownFiles().forEach((file) => {
      this.getElement(file).removeClass(editClassName)
      this.getElement(file).removeClass(publishClassName)
    })
  }

  update(file) {
    // get the file's frontmatter and add or remove the CSS class
    const metadata = this.app.metadataCache.getFileCache(file)
    const element = this.getElement(file)

    if (metadata.frontmatter?.editing_lock === true) {
      element.addClass(editClassName)
    } else {
      element.removeClass(editClassName)
    }

    if (metadata.frontmatter?.publish === true) {
      element.addClass(publishClassName)
    } else {
      element.removeClass(publishClassName)
    }
  }

  getElement(file) {
    return this.app.workspace
      .getLeavesOfType('file-explorer')
      .find((leaf) => leaf.view.getViewType() === 'file-explorer').view
      .fileItems[file.path].el
  }
}
