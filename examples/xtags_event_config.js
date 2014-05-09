import {Inject} from 'di'

// TODO(vojta): can we use value?
@Inject
export function XTagsEventConfig() {
  return [{
    nodeName: 'x-toggle', events: ['change'], properties: ()=>['checked']
  }];
}
