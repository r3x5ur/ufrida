export type SocketAddress =
  | IPV4SocketAddress
  | IPV6SocketAddress
  | AnonymousUnixSocketAddress
  | PathUnixSocketAddress
  | AbstractUnixSocketAddress

export interface IPV4SocketAddress {
  family: 'ipv4'
  address: string
  port: number
}

export interface IPV6SocketAddress {
  family: 'ipv6'
  address: string
  port: number
  flowlabel: number
  scopeid: number
}

export interface AnonymousUnixSocketAddress {
  family: 'unix:anonymous'
}

export interface PathUnixSocketAddress {
  family: 'unix:path'
  path: string
}

export interface AbstractUnixSocketAddress {
  family: 'unix:abstract'
  path: Buffer
}
