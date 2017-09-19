# FabricExplorer浏览区块的操作

###  1. git 项目到服务器
```
git clone https://github.com/zhaoliang1133/fabric-explorer.git
```
### 2. 删除原始证书
```
cd  fabric-explorer
rm -rf ./artifacts/crypto-config/
```
### 3. 把项目证书复制过来
- 进入到项目证书目录
```
/root/fabric-tools/fabric-scripts/hlfv1/composer
```
- 复制证书到浏览区块项目
```
cp -r crypto-config /root/fabric-explorer/artifacts
```
### 4. 修改config.json文件为
```
{
  "host":"localhost",
  "port":"8080",
  "channelsList": ["composerchannel"],
  "GOPATH":"../artifacts",
  "keyValueStore":"/tmp/fabric-client-kvs",
  "eventWaitTime":"30000",
  "enableTls":false,
  "users":[
      {
        "username":"admin",
        "secret":"adminpw"
      }
  ],
  "mysql":{
      "host":"localhost",
      "database":"fabricexplorer",
      "port":"3306",
      "username":"root",
      "passwd":"123456"
  }
}

```
### 5. 修改app/network-config.json文件为
```
{
    "network-config": {
        "orderer": [{
            "url": "grpc://127.0.0.1:7050",
            "server-hostname": "orderer.example.com"
        }],
        "org1": {
            "name": "peerOrg1",
            "mspid": "Org1MSP",
            "ca": "http://127.0.0.1:7054",
            "peer1": {
                "requests": "grpc://127.0.0.1:7051",
                "events": "grpc://127.0.0.1:7053",
                "server-hostname": "peer0.org1.example.com"
            },
            "admin": {
                "key": "/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore",
                "cert": "/artifacts/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts"
            }
        }
    }
}
```
### 6. 安装依赖
```
npm install
```
### 7. 启动项目
```
./start.sh
```
### 8. 查看日志
```
cat log.log
```
### 9. 访问地址
```
http://localhost:8080/#
```