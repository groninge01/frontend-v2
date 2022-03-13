import BalAsset from './BalAsset.vue';
import { generateTemplate } from '../../../../.storybook/helpers/templates';

export default {
  component: BalAsset,
  title: 'Components/BalAsset',
  args: {
    address: '',
    darkMode: false
  }
};

type Props = {
  address?: string;
  iconURI?: string;
  size?: number;
};

const Template = (args: Props) => ({
  components: { BalAsset },
  setup() {
    return { args };
  },
  template: generateTemplate(`
<BalAsset v-bind="args"></BalAsset>`)
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = {
  address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  iconURI:
    'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png'
};
