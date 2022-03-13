import BalModal from './BalModal.vue';
import { generateTemplate } from '../../../../.storybook/helpers/templates';

export default {
  component: BalModal,
  title: 'Components/BalModal',
  args: {
    title: '',
    darkMode: false
  }
};

type Props = {
  show?: boolean;
  title?: string;
  noPad?: boolean;
};

const Template = (args: Props) => ({
  components: { BalModal },
  setup() {
    return { args };
  },
  template: generateTemplate(`
<BalModal v-bind="args" @close="args.show = false">
  content
</BalModal>`)
});

export const Primary = Template.bind({});
// @ts-ignore
Primary.args = { title: 'A title', show: true };

export const WithFooter = (args: Props) => ({
  components: { BalModal },
  setup() {
    return { args };
  },
  template: generateTemplate(`
<BalModal v-bind="args" @close="args.show = false">
  content
  <template v-slot:footer>
    Action
  </template>
</BalModal>`)
});
WithFooter.args = { title: 'A title', show: true };

export const WithALotOfContent = (args: Props) => ({
  components: { BalModal },
  setup() {
    return { args };
  },
  template: generateTemplate(`
<BalModal v-bind="args" @close="args.show = false">
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet aliquam id diam maecenas ultricies. Ultrices eros in cursus turpis massa tincidunt dui ut ornare. Tincidunt vitae semper quis lectus. Vitae justo eget magna fermentum. Facilisis magna etiam tempor orci eu lobortis elementum nibh. Porttitor massa id neque aliquam vestibulum morbi. Etiam dignissim diam quis enim lobortis scelerisque. Sit amet volutpat consequat mauris nunc congue. Aliquet eget sit amet tellus. Ut consequat semper viverra nam. Vivamus arcu felis bibendum ut tristique et egestas quis ipsum. Sed vulputate odio ut enim blandit volutpat maecenas volutpat. Libero justo laoreet sit amet cursus sit amet dictum. Vel risus commodo viverra maecenas accumsan lacus vel. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.

Dolor morbi non arcu risus quis. Quis vel eros donec ac odio tempor. Tincidunt tortor aliquam nulla facilisi cras fermentum odio. Ac felis donec et odio pellentesque. Accumsan tortor posuere ac ut consequat semper viverra. At in tellus integer feugiat scelerisque varius morbi. Eget nunc lobortis mattis aliquam faucibus purus in massa tempor. Rhoncus aenean vel elit scelerisque. Potenti nullam ac tortor vitae purus faucibus ornare. Interdum consectetur libero id faucibus nisl tincidunt eget nullam. Nulla malesuada pellentesque elit eget. Nec ullamcorper sit amet risus nullam eget felis. Non diam phasellus vestibulum lorem sed. Pulvinar neque laoreet suspendisse interdum consectetur libero id faucibus nisl.

Lobortis elementum nibh tellus molestie nunc. Ullamcorper eget nulla facilisi etiam dignissim. Urna et pharetra pharetra massa massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Duis at tellus at urna condimentum mattis pellentesque id. Ut tellus elementum sagittis vitae et. Egestas pretium aenean pharetra magna ac placerat vestibulum. Et leo duis ut diam quam nulla. Potenti nullam ac tortor vitae purus faucibus ornare. Amet porttitor eget dolor morbi non arcu risus. Tortor id aliquet lectus proin nibh nisl condimentum id. Elementum tempus egestas sed sed risus. Ornare lectus sit amet est placerat. Lobortis feugiat vivamus at augue eget arcu dictum varius. Diam ut venenatis tellus in metus vulputate eu. Dictum non consectetur a erat nam at. Sed risus pretium quam vulputate dignissim suspendisse in est. Id velit ut tortor pretium viverra.

Viverra tellus in hac habitasse platea dictumst vestibulum rhoncus. Eleifend mi in nulla posuere sollicitudin. Sed velit dignissim sodales ut eu sem integer vitae. Felis imperdiet proin fermentum leo vel orci. Cursus mattis molestie a iaculis at. Cras tincidunt lobortis feugiat vivamus at. Fermentum leo vel orci porta non pulvinar neque laoreet. Fermentum dui faucibus in ornare quam viverra orci sagittis. Orci porta non pulvinar neque laoreet suspendisse. Dignissim suspendisse in est ante in.

Nulla at volutpat diam ut. Orci porta non pulvinar neque. Dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu. Congue quisque egestas diam in. Faucibus pulvinar elementum integer enim neque volutpat ac. Risus nullam eget felis eget nunc. Purus ut faucibus pulvinar elementum integer. Et pharetra pharetra massa massa ultricies. Justo laoreet sit amet cursus sit amet dictum sit. Enim nec dui nunc mattis enim. Congue eu consequat ac felis donec et odio pellentesque. Leo a diam sollicitudin tempor id eu nisl nunc. Orci sagittis eu volutpat odio facilisis mauris. Diam in arcu cursus euismod quis. Lorem ipsum dolor sit amet consectetur. Sed ullamcorper morbi tincidunt ornare. Orci ac auctor augue mauris augue neque gravida in fermentum.
  <template v-slot:footer>
    Action
  </template>
</BalModal>`)
});
WithALotOfContent.args = {
  title: 'A title',
  show: true,
  selfCenterFooter: true,
  hCustomContent: true,
  overflowAutoContent: true
};
