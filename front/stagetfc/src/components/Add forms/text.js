   /* if (idmember) {
      const found = initialoptions.find(opt => opt.value === parseInt(idmember));
      if (found) {
        if (singleselectedoption) {
          // If a main supervisor has already been selected, place the new supervisor in the "Other Supervisors" list
          setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
          setmultioptions(prev => prev.filter(opt => opt.value !== found.value));
          setmultiselectedoptions(prev => [...prev, found]);
          
        } 
        else {
          // If no main supervisor is selected, prompt the user
          Swal.fire({
            title: 'Where do you want to place the new supervisor?',
            text: 'You have not selected a Main Supervisor yet.',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Main Supervisor',
            denyButtonText: 'Other Supervisor'
          }).then(result => {
            if (result.isConfirmed) {
              // When user selects "Main Supervisor", add to the main supervisor list
              setsingleselectedoption(found);
              // Remove from "Other Supervisors" list
              setmultiselectedoptions(prev => prev.filter(opt => opt.value !== found.value));
              // Remove from "Single Options" list (if it's there)
              setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
            }
            else if (result.isDenied) {
              // When user selects "Other Supervisor", add to the "Other Supervisors" list
              setmultiselectedoptions(prev => [...prev, found]);
              // Ensure it is removed from "Main Supervisor"
              setsingleselectedoption(null); // Clear Main Supervisor if any
              // Remove from "Single Options"
              setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
            }
          });
        }
      }
    }
  }, [initialoptions, searchparams, singleselectedoption]);
    useEffect(() => {
    const selectedOptions = multiSelectOptions.filter(option =>
      multiselectedFromURL.includes(option.value.toString())
    );
    setMultiselectedoptions(selectedOptions);
  }, [multiSelectOptions]);
  
  */
  initialoptions, searchparams, singleselectedoption

  if (initialoptions.length === 0) return;
  
  if (onlysupid) {
    const found = initialoptions.find(opt => opt.value === parseInt(onlysupid));
    if (found) {
      setmultiselectedoptions(prev => [...prev, found]);
      setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
      setmultioptions(prev => prev.filter(opt => opt.value !== found.value));
    }
  }

  if (idmember) {
    const found = initialoptions.find(opt => opt.value === parseInt(idmember));
    if (found) {
      if (singleselectedoption) {
        // If a main supervisor has already been selected, place the new supervisor in the "Other Supervisors" list
        setmultiselectedoptions(prev => [...prev, found]);
        setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
        setmultioptions(prev => prev.filter(opt => opt.value !== found.value));
      } else {
        // If no main supervisor is selected, prompt the user
        Swal.fire({
          title: 'Where do you want to place the new supervisor?',
          text: 'You have not selected a Main Supervisor yet.',
          icon: 'question',
          showDenyButton: true,
          confirmButtonText: 'Main Supervisor',
          denyButtonText: 'Other Supervisor'
        }).then(result => {
          if (result.isConfirmed) {
            // When user selects "Main Supervisor", add to the main supervisor list
            setsingleselectedoption(found);
            // Remove from "Other Supervisors" list
            setmultiselectedoptions(prev => prev.filter(opt => opt.value !== found.value));
            // Remove from "Single Options" list (if it's there)
            setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
          } 
          else if (result.isDenied) {
            // When user selects "Other Supervisor", add to the "Other Supervisors" list
            setmultiselectedoptions(prev => [...prev, found]);
            // Ensure it is removed from "Main Supervisor"
            setsingleselectedoption(null); // Clear Main Supervisor if any
            // Remove from "Single Options"
            setsingleoptions(prev => prev.filter(opt => opt.value !== found.value));
          }
        });
      }
    }
