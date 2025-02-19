import { Block } from '@/services/base-component';
import stubTemplate from '@/components/Stub/stub.hbs?raw';
import PageTitle from '@/components/PageTitle';
import Link from '@/components/Link';
import { withRouter } from '@/utils/events';
import { IProps, RequiredKeys } from '@/types';
import { ERouter } from '@/constants/router';
import '@/components/Stub/stub.pcss';

class ServerErrorPage extends Block {
    constructor(props = {} as RequiredKeys<IProps, 'router'>) {
        super('div', {
            ...props,
            ...{
                settings: {
                    isSimple: true,
                },
                pageTitle: new PageTitle('h1', {
                    settings: {
                        isSimple: true,
                    },
                    title: '500 ошибка',
                }),
                GoHome: new Link('a', {
                    settings: {
                        isSimple: true,
                    },
                    href: '#',
                    linkName: 'Назад',
                    '@click': () => props.router.go(ERouter.LOGIN),
                }),
            },
        });
    }

    render() {
        return this.compile(stubTemplate);
    }
}

export default withRouter(ServerErrorPage as typeof Block);
