import _ from 'lodash';

class Transformer {
  data: any;
  properties: any = {};

  constructor(data: any, properties: any) {
    this.data = data;
    this.properties = properties;
  }

  async transformItem(item: any) {
    if (!item) {
      return null;
    }

    const itemData = _.pick(item, this.properties);

    return { ...itemData };
  }

  async transform() {
    if (this.data === undefined || this.data === null) {
      return null;
    }

    if (!Array.isArray(this.data)) {
      return await this.transformItem(this.data);
    }

    const length = this.data.length;
    const result = [];
    for (let i = 0; i < length; i += 1) {
      result.push(await this.transformItem(this.data[i]));
    }

    return result;
  }
}

export default Transformer;

