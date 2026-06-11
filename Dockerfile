FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /code

# Copy requirements from the Backend folder and install them
COPY ./Backend/requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the entire Backend folder contents into /code
COPY ./Backend /code

# Run Uvicorn pointing to the app module inside the copied files
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]