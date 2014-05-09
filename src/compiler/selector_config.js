import {Inject} from 'di'

// TODO(vojta): can we use value?
@Inject
export function SelectorConfig() {
  return {
    interpolationRegex: /{{(.*?)}}/g,
    bindAttrRegex: /bind-(.+)/,
    eventAttrRegex: /on-(.+)/,
  };
}
