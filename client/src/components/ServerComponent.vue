<script lang="ts">
import axios from 'axios';

export default axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});
</script>
