FROM python:3.7.3-stretch

COPY requirements.txt /tmp/

RUN pip install -r /tmp/requirements.txt


RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

COPY app.py .
COPY discrete_minmax.py .
COPY discrete_spline_minmax.py .
COPY lssq.py .
COPY minmax_modified.py .
COPY minmax_one_end_attached.py .
COPY minmax.py .
COPY spline_cont.py .
COPY spline_minmax.py .
COPY spline_with_specified_numbers_of_segments.py .
ADD templates ./templates

CMD [ "python", "./app.py" ]