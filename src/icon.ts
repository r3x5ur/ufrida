export type Icon = RGBAIcon | PNGIcon

export interface RGBAIcon {
  format: 'rgba'
  width: number
  height: number
  image: Buffer
}

export interface PNGIcon {
  format: 'png'
  width?: number
  height?: number
  image: Buffer
}
