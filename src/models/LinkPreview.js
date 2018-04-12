import { BaseModel } from 'awry-utilities';

class LinkPreview extends BaseModel {
  constructor(attributes) {
    const newAttributes = Object.assign({
      images: [],
    }, attributes);

    super(newAttributes);
  }

  getImage = () => {
    if (this.images.length > 0) {
      return this.images[0];
    }

    return null;
  }
}

export default LinkPreview;
