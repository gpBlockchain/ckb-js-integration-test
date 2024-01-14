git clone https://github.com/ckb-js/lumos.git
cd lumos
git checkout develop
cd ../
git clone https://github.com/gpBlockchain/ckb-rpc-mock-data.git
cd ckb-rpc-mock-data
git checkout v0.111.0
pip install -r requirements.txt
pip install Werkzeug==2.2.2
python3 api/index.py > index.log 2>&1 &
sleep 5
cat index.log
cd ../
git clone https://github.com/gpBlockchain/ckb-light-client-rpc-mock-data.git
cd ckb-light-client-rpc-mock-data
python3 api/index.py > index.log 2>&1 &
sleep 5
cat index.log