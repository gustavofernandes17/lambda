export interface configurationSchemaProperties {
  yt_api_base_url: string;
  web3proxy_api_base_url: string;
  download_directory_path: string;
  id: string
}

export const ConfigurationSchema = {
  name: 'Configuration', 
  primary_key: 'id',
  properties: {
    id: 'string', 
    yt_api_base_url: 'string', 
    download_directory_path: 'string',
    web3proxy_api_base_url: 'string'
  }
}