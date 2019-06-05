const BaseHeader = () => import('@/components/base/BaseHeader')

const InventoryMain = () => import('@/services/inventory/InventoryMain')
const InventorySidebar = () => import('@/services/inventory/InventorySidebar')

const NetworkMain = () => import('@/services/inventory/network/NetworkMain')
const Network = () => import('@/services/inventory/network/Network')
const IPAdress = () => import('@/services/inventory/network/IPAdress')
const NetworkType = () => import('@/services/inventory/network/NetworkType')

const DataCenter = () => import('@/services/inventory/DataCenter')
const Server = () => import('@/services/inventory/Server')

export default {
  path: 'inventory',
  name: 'inventory',
  redirect: 'inventory/data-center',
  meta: { label: 'Inventory' },
  components: {
    header: BaseHeader,
    sidebar: InventorySidebar,
    main: InventoryMain
  },
  children: [
    {
      path: 'data-center',
      name: 'dataCenter',
      meta: { label: 'DataCenter' },
      component: DataCenter
    },
    {
      path: 'server',
      name: 'server',
      meta: { label: 'Server' },
      component: Server
    },
    {
      path: 'network',
      component: NetworkMain,
      children: [
        {
          path: 'network',
          name: 'network',
          meta: { label: 'Network' },
          component: Network
        },
        {
          path: 'ip-address',
          name: 'ipAddress',
          meta: { label: 'IP Address' },
          component: IPAdress
        },
        {
          path: 'type',
          name: 'networkType',
          meta: { label: 'Network Type' },
          component: NetworkType
        }
      ]
    }
  ]
}