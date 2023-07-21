git clone https://github.com/ckb-js/lumos.git
cd lumos
git checkout ckb2023
cd ../
git clone https://github.com/gpBlockchain/ckb-rpc-mock-data.git
cd ckb-rpc-mock-data
pip install -r requirements.txt
cd ckb-rpc-mock-data
python3 api/index.py > index.log 2>&1 &