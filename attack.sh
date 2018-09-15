while true
do
  kubectl delete pods --all >/dev/null; sleep 2;
  echo 'sending attack...'
done
