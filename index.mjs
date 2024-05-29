import morphdom from "morphdom"

const MorphdomMixin = (superclass) => class extends superclass {
  constructor(args) {
    super(args)
    this.process = this.process.bind(this)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.process()
    }
  }

  process() {
    const tmp = this.render({
      html: this.html,
      state: this.state
    }).trim()

    const updated = document.createElement('div')
    updated.innerHTML = tmp

    if (this['scrubTemplate']) {
      this.scrubTemplate(updated)
    }

    const root = this.shadowRoot
      ? this.shadowRoot
      : this

    if (!this.shadowRoot && this['expandSlots']) {
      const slotEl = document.createElement('div')
      const slottedElements = root.querySelectorAll('[slot=" "]')
      for (const value of slottedElements.values()) {
        slotEl.appendChild(value)
      }
      updated.innerHTML = this.expandSlots(slotEl.innerHTML, updated.innerHTML)
    }

    morphdom(
      root,
      updated,
      {
        childrenOnly: true
      }
    )
  }
}
export default MorphdomMixin
