
import moment from 'moment';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $unixtimeToDate: (val: number) => string;
        $moment: typeof moment;
    }
}

export default {
    install(app: any, options: []) {
        app.config.globalProperties.$moment = (value: any) => moment(value);
        app.config.globalProperties.$unixtimeToDate = (value: number) => {
            if (!value)
                return '';

            let instant = moment(value * 1000);

            if (!instant.isValid())
                return '';

            return instant.format('YYYY-MM-DD hh:mm:ss');
        }
    }
}