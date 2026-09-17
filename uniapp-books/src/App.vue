<script>
import { checkForUpdateOnLaunch } from '@/utils/app-update';

export default {
  onLaunch() {
    checkForUpdateOnLaunch();
  },
};
</script>

<style lang="scss">
@import './uni.scss';

page {
  background-color: #f3ead8;
  background-image:
    radial-gradient(circle at 15% 8%, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0) 42%),
    radial-gradient(circle at 85% 2%, rgba(196, 168, 122, 0.28), rgba(196, 168, 122, 0) 46%);
  color: #43382d;
  font-family: Georgia, 'Songti SC', 'STSong', 'SimSun', 'Times New Roman', serif;
  font-size: 28rpx;
  line-height: 1.7;
}
</style>
